const { prisma } = require("../../config/database");
const { round2 } = require("../../utils/money");
const { range } = require("./reports.service");

const sum = (list, key) => round2(list.reduce((total, r) => total + r[key], 0));

// The money figures of a group of sold items. Profit counts only items that had a cost price
const figures = (list) => {
  const revenue = sum(list, "revenue");
  const costedRevenue = sum(list, "costedRevenue");
  const cost = sum(list, "cost");
  const profit = round2(costedRevenue - cost);
  return {
    quantity: list.reduce((total, r) => total + r.quantity, 0),
    revenue,
    cost,
    profit,
    margin: costedRevenue > 0 ? Math.round((profit / costedRevenue) * 1000) / 10 : null, // null = no cost price known
    uncostedRevenue: round2(revenue - costedRevenue), // sales that had no cost price
  };
};

// Groups rows by a key, keeping the order they first appear in
const group = (rows, keyOf) => {
  const map = new Map();
  for (const r of rows) {
    const key = keyOf(r);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(r);
  }
  return map;
};

// ?from=2026-11-01&to=2026-11-30&group=day|month. Cancelled and refunded orders do not count.
// A discount on an order is shared across its items in proportion to their prices
const report = async (query) => {
  const { from, end } = range(query);
  const unit = query.group === "month" ? "month" : "day";

  const [rows, discounts] = await Promise.all([
    prisma.$queryRaw`
      SELECT date_trunc(${unit}, t."createdAt") AS period, t.name,
             SUM(t.quantity)::int AS quantity,
             COALESCE(SUM(t.net), 0)::float AS revenue,
             COALESCE(SUM(CASE WHEN t."unitCost" IS NOT NULL THEN t.net END), 0)::float AS "costedRevenue",
             COALESCE(SUM(t."unitCost" * t.quantity), 0)::float AS cost
      FROM (
        SELECT o."createdAt", oi."productName" AS name, oi.quantity, oi."unitCost",
               oi."lineTotal" * (1 - COALESCE(o."discountTotal" / NULLIF(o.subtotal, 0), 0)) AS net
        FROM order_items oi
        JOIN orders o ON o.id = oi."orderId"
        WHERE o."createdAt" >= ${from.toISOString()}::timestamp
          AND o."createdAt" < ${end.toISOString()}::timestamp
          AND o.status NOT IN ('PENDING', 'CANCELLED', 'REFUNDED')
      ) t
      GROUP BY 1, 2 ORDER BY 1`,
    prisma.order.aggregate({
      where: { createdAt: { gte: from, lt: end }, status: { notIn: ["PENDING", "CANCELLED", "REFUNDED"] } },
      _sum: { discountTotal: true },
    }),
  ]);

  const byPeriod = [...group(rows, (r) => r.period.toISOString())].map(([period, list]) => ({ period, ...figures(list) }));
  const byProduct = [...group(rows, (r) => r.name)]
    .map(([name, list]) => ({ name, ...figures(list) }))
    .sort((a, b) => b.profit - a.profit || b.revenue - a.revenue) // best profit first
    .slice(0, 50);

  return {
    from,
    to: end,
    group: unit,
    totals: figures(rows),
    discounts: round2(Number(discounts._sum.discountTotal ?? 0)),
    byPeriod,
    byProduct,
  };
};

module.exports = { report };
