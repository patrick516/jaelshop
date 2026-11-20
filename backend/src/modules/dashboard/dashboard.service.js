const { prisma } = require("../../config/database");

const DAY = 24 * 60 * 60 * 1000; // one day in milliseconds
const countable = { notIn: ["CANCELLED", "REFUNDED"] }; // these orders do not count as sales

// % change from previous to current, one decimal. From zero, any growth shows as 100
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
  const from = new Date(now.getTime() - days * DAY); // start of the chosen period
  const prevFrom = new Date(from.getTime() - days * DAY); // start of the period before it
  const unit = days > 90 ? "month" : "day"; // the 1Y chart groups by month
  const created = (a, b) => ({ createdAt: { gte: a, lt: b } });

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
    lowStockCount: lowStock[0].count,
  };
};

module.exports = { summary };
