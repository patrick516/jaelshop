const { prisma } = require("../../config/database");
const { round2 } = require("../../utils/money");

// What every customer has ordered and paid, as a Map keyed by customer id.
// Cancelled and refunded orders do not count. balance is what they still owe
const totalsByCustomer = async () => {
  const rows = await prisma.$queryRaw`
    SELECT o."customerId" AS id, COUNT(*)::int AS "orderCount",
           COALESCE(SUM(o.total), 0)::float AS ordered,
           COALESCE(SUM(pd.paid), 0)::float AS paid
    FROM orders o
    LEFT JOIN (
      SELECT "orderId", SUM(amount) AS paid FROM payments WHERE status = 'PAID' GROUP BY "orderId"
    ) pd ON pd."orderId" = o.id
    WHERE o."customerId" IS NOT NULL AND o.status NOT IN ('PENDING', 'CANCELLED', 'REFUNDED')
    GROUP BY o."customerId"`;

  return new Map(
    rows.map((r) => [
      r.id,
      {
        orderCount: r.orderCount,
        ordered: r.ordered,
        paid: r.paid,
        balance: round2(r.ordered - r.paid),
      },
    ]),
  );
};

module.exports = { totalsByCustomer };
