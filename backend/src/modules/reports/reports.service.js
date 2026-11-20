const { prisma } = require("../../config/database");

const DAY = 24 * 60 * 60 * 1000; // one day in milliseconds

// Turns ?from and ?to into two dates. "to" is inclusive, so the range ends at the start of the next day
const range = (query) => {
  const to = query.to ? new Date(query.to) : new Date();
  const end = query.to ? new Date(to.getTime() + DAY) : to;
  const from = query.from
    ? new Date(query.from)
    : new Date(end.getTime() - 30 * DAY); // default: last 30 days
  return { from, end };
};

// Sales and order counts per day or month. Cancelled and refunded orders do not count
const sales = async (query) => {
  const { from, end } = range(query);
  const unit = query.group === "month" ? "month" : "day";
  const rows = await prisma.$queryRaw`
    SELECT date_trunc(${unit}, "createdAt") AS period, COUNT(*)::int AS orders, COALESCE(SUM(total), 0)::float AS sales
    FROM orders
       WHERE "createdAt" >= ${from.toISOString()}::timestamp AND "createdAt" < ${end.toISOString()}::timestamp AND status NOT IN ('CANCELLED', 'REFUNDED')
    GROUP BY 1 ORDER BY 1`;
  const totalOrders = rows.reduce((sum, r) => sum + r.orders, 0);
  const totalSales = rows.reduce((sum, r) => sum + r.sales, 0);
  return { from, to: end, group: unit, totalOrders, totalSales, rows };
};

// Best sellers by quantity. The product name comes from the order line, so old orders keep their old names
const topProducts = async (query) => {
  const { from, end } = range(query);
  const limit = Number(query.limit) || 10;
  const rows = await prisma.$queryRaw`
    SELECT oi."productName" AS name, SUM(oi.quantity)::int AS quantity, SUM(oi."lineTotal")::float AS revenue
    FROM order_items oi
    JOIN orders o ON o.id = oi."orderId"
        WHERE o."createdAt" >= ${from.toISOString()}::timestamp AND o."createdAt" < ${end.toISOString()}::timestamp AND o.status NOT IN ('CANCELLED', 'REFUNDED')
    GROUP BY oi."productName" ORDER BY quantity DESC LIMIT ${limit}`;
  return { from, to: end, rows };
};

// Payments grouped by method and status (Airtel Money, TNM Mpamba, cash, bank)
const payments = async (query) => {
  const { from, end } = range(query);
  const groups = await prisma.payment.groupBy({
    by: ["method", "status"],
    where: { createdAt: { gte: from, lt: end } },
    _sum: { amount: true },
    _count: { _all: true },
  });
  const rows = groups.map((g) => ({
    method: g.method,
    status: g.status,
    count: g._count._all,
    amount: Number(g._sum.amount ?? 0), // Decimal to plain number
  }));
  return { from, to: end, rows };
};

// What the stock on the shelf is worth. Staff only, because it includes the cost price
const stock = async () => {
  const [row] = await prisma.$queryRaw`
    SELECT COALESCE(SUM(i.quantity), 0)::int AS units,
           COALESCE(SUM(i.quantity * COALESCE(p."costPrice", 0)), 0)::float AS "costValue",
           COALESCE(SUM(i.quantity * COALESCE(v."priceOverride", p.price)), 0)::float AS "retailValue",
           COUNT(*) FILTER (WHERE i.quantity <= i."lowStockThreshold")::int AS "lowStockVariants"
    FROM inventory i
    JOIN product_variants v ON v.id = i."variantId"
    JOIN products p ON p.id = v."productId"`;
  return row;
};

module.exports = { sales, topProducts, payments, stock };
