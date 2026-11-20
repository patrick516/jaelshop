const ApiError = require("../../utils/ApiError");
const { round2 } = require("../../utils/money");

const mk = (n) => `MK ${Number(n).toLocaleString("en-US")}`;

// "10% off" or "MK 5,000 off"
const describe = (c) =>
  c.discountType === "PERCENTAGE"
    ? `${Number(c.discountValue)}% off`
    : `${mk(c.discountValue)} off`;

// Finds a code and checks every rule. db is prisma, or a transaction (tx) when an order is being placed.
// Returns the coupon and how much it takes off the PRODUCTS (never the delivery fee)
const findUsable = async (db, code, subtotal) => {
  const coupon = await db.coupon.findUnique({
    where: { code: String(code).trim().toUpperCase() },
  });
  const now = new Date();

  if (!coupon || !coupon.isActive) throw new ApiError(400, "This code is not valid");
  if (coupon.startsAt && coupon.startsAt > now) throw new ApiError(400, "This code is not active yet");
  if (coupon.expiresAt && coupon.expiresAt < now) throw new ApiError(400, "This code has expired");
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses)
    throw new ApiError(400, "This code has been fully used");
  if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount))
    throw new ApiError(400, `Spend at least ${mk(coupon.minOrderAmount)} to use this code`);

  const raw =
    coupon.discountType === "PERCENTAGE"
      ? (subtotal * Number(coupon.discountValue)) / 100
      : Number(coupon.discountValue);
  return { coupon, discount: round2(Math.min(raw, subtotal)) }; // never more than the products cost
};

// Counts one use. The condition is part of the update, so two buyers can never take the last use
const redeem = async (tx, coupon) => {
  const where = { id: coupon.id };
  if (coupon.maxUses !== null) where.usedCount = { lt: coupon.maxUses };
  const result = await tx.coupon.updateMany({
    where,
    data: { usedCount: { increment: 1 } },
  });
  if (result.count === 0) throw new ApiError(409, "This code has just been fully used");
};

module.exports = { findUsable, redeem, describe };
