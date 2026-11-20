// Round to 2 decimals, so 0.1 + 0.2 never shows as 0.30000000000000004
const round2 = (n) => Math.round(n * 100) / 100;

// How much of an order has been paid. Only payments marked PAID count
const sumPaid = (payments) =>
  round2(
    payments
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + Number(p.amount), 0),
  );

module.exports = { round2, sumPaid };
