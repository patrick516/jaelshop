const { prisma } = require("../../config/database");
const settingsService = require("../settings/settings.service");

const DAY = 24 * 60 * 60 * 1000;
const countable = { notIn: ["CANCELLED", "REFUNDED"] };
const percentChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
};

// Orders and money inside one time window
const orderTotals = (from, to) =>
  prisma.order.aggregate({
    where: { createdAt: { gte: from, lt: to }, status: countable },
    _sum: { total: true },
    _count: { _all: true },
  });

const summary = async (query) => {
  const days = Number(query.days) || 30;
  const now = new Date();
  const from = new Date(now.getTime() - days * DAY);
  const prevFrom = new Date(from.getTime() - days * DAY);
  const unit = days > 90 ? "month" : "day";
  const created = (a, b) => ({ createdAt: { gte: a, lt: b } });

  const settings = await settingsService.getAll();
  const staleHours = Number(settings.pendingAlertHours) || 24;
  const staleBefore = new Date(now.getTime() - staleHours * 60 * 60 * 1000);
  const staleWhere = { status: "PENDING", createdAt: { lt: staleBefore } };
  const [stale, staleCount] = await Promise.all([
    prisma.order.findMany({
      where: staleWhere,
      orderBy: { createdAt: "asc" },
      take: 20,
      include: { _count: { select: { items: true } } },
    }),
    prisma.order.count({ where: staleWhere }),
  ]);

  // Run every query at the same time
  const [
    cur,
    prev,
    customers,
    newCust,
    prevCust,
    products,
    newProd,
    prevProd,
    pending,
    lowStock,
    chart,
    cats,
    recent,
  ] = await Promise.all([
    orderTotals(from, now),
    orderTotals(prevFrom, from),
    prisma.customer.count(),
    prisma.customer.count({ where: created(from, now) }),
    prisma.customer.count({ where: created(prevFrom, from) }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.product.count({ where: created(from, now) }),
    prisma.product.count({ where: created(prevFrom, from) }),
    prisma.order.count({ where: { status: "PENDING" } }), // the red badge next to Orders
    // Stock at or under its warning level. ::int makes the count a plain number
    prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM inventory WHERE quantity <= "lowStockThreshold"`,
    // Sales and orders per day (or month). ::float turns money into a plain number
    prisma.$queryRaw`
        SELECT date_trunc(${unit}, "createdAt") AS day, COUNT(*)::int AS orders, COALESCE(SUM(total), 0)::float AS sales
        FROM orders
               WHERE "createdAt" >= ${from.toISOString()}::timestamp AND status NOT IN ('CANCELLED', 'REFUNDED')
        GROUP BY 1 ORDER BY 1`,
    // Sales per category: order lines -> variant -> product -> category
    prisma.$queryRaw`
        SELECT c.name, COALESCE(SUM(oi."lineTotal"), 0)::float AS sales
        FROM order_items oi
        JOIN orders o ON o.id = oi."orderId"
        JOIN product_variants v ON v.id = oi."variantId"
        JOIN products p ON p.id = v."productId"
        JOIN categories c ON c.id = p."categoryId"
             WHERE o."createdAt" >= ${from.toISOString()}::timestamp AND o.status NOT IN ('CANCELLED', 'REFUNDED')
        GROUP BY c.name ORDER BY sales DESC LIMIT 5`,
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { items: true } },
        payments: { select: { method: true }, take: 1 },
      },
    }),
  ]);

  const curSales = Number(cur._sum.total ?? 0); // the sum is empty when there are no orders
  const prevSales = Number(prev._sum.total ?? 0);
  const catTotal = cats.reduce((sum, c) => sum + c.sales, 0);

  return {
    days,
    cards: {
      orders: {
        value: cur._count._all,
        change: percentChange(cur._count._all, prev._count._all),
      },
      customers: { value: customers, change: percentChange(newCust, prevCust) },
      sales: { value: curSales, change: percentChange(curSales, prevSales) },
      products: { value: products, change: percentChange(newProd, prevProd) },
    },
    salesOverview: chart.map((r) => ({
      date: r.day,
      sales: r.sales,
      orders: r.orders,
    })),
    // share = percent of all category sales in this period
    topCategories: cats.map((c) => ({
      name: c.name,
      sales: c.sales,
      share: catTotal ? Math.round((c.sales / catTotal) * 100) : 0,
    })),
    recentOrders: recent.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: o.shippingName,
      items: o._count.items,
      total: o.total,
      paymentMethod: o.payments[0]?.method ?? null,
      status: o.status,
      createdAt: o.createdAt,
    })),
    pendingOrders: pending,
    staleHours,
    staleCount,
    stalePending: stale.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: o.shippingName,
      phone: o.shippingPhone,
      items: o._count.items,
      total: o.total,
      source: o.source,
      createdAt: o.createdAt,
      hoursPending: Math.floor(
        (now.getTime() - o.createdAt.getTime()) / 3600000,
      ), // whole hours waiting
    })),
    lowStockCount: lowStock[0].count,
  };
};

module.exports = { summary };
