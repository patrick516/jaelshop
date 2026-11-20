import { formatDate, formatMK } from "@/lib/format";

export type DiscountType = "PERCENTAGE" | "FIXED";

export type Coupon = {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: string; // money arrives as text
  minOrderAmount: string | null;
  maxUses: number | null; // null means unlimited
  usedCount: number;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
};

export type CouponState = "active" | "off" | "scheduled" | "expired" | "used-up";

// What a code is doing right now
export const couponState = (c: Coupon): CouponState => {
  const now = Date.now();
  if (!c.isActive) return "off";
  if (c.startsAt && new Date(c.startsAt).getTime() > now) return "scheduled";
  if (c.expiresAt && new Date(c.expiresAt).getTime() < now) return "expired";
  if (c.maxUses !== null && c.usedCount >= c.maxUses) return "used-up";
  return "active";
};

// "10% off" or "MK 5,000 off"
export const describeDiscount = (c: Coupon): string => (c.discountType === "PERCENTAGE" ? `${Number(c.discountValue)}% off` : `${formatMK(c.discountValue)} off`);

// "1 Nov 2026 to 30 Nov 2026", or "Always" when there are no dates
export const validity = (c: Coupon): string => {
  if (!c.startsAt && !c.expiresAt) return "Always";
  return `${c.startsAt ? formatDate(c.startsAt) : "Now"} to ${c.expiresAt ? formatDate(c.expiresAt) : "no end"}`;
};
