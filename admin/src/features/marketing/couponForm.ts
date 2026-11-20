import type { Coupon, DiscountType } from "./types";

// Every field is text while the staff member types. toPayload turns them into what the backend expects
export type CouponValues = {
  code: string;
  discountType: DiscountType;
  discountValue: string;
  minOrderAmount: string;
  maxUses: string;
  startsAt: string; // YYYY-MM-DD from the date box
  expiresAt: string;
  isActive: boolean;
};

const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-CA") : ""); // the date in the visitor's time zone
const num = (v: string) => (v.trim() === "" ? null : Number(v));

// A saved code as form text. null gives an empty form for a new one
export const toValues = (c: Coupon | null): CouponValues => ({
  code: c?.code ?? "",
  discountType: c?.discountType ?? "PERCENTAGE",
  discountValue: c ? String(Number(c.discountValue)) : "",
  minOrderAmount: c?.minOrderAmount ? String(Number(c.minOrderAmount)) : "",
  maxUses: c?.maxUses ? String(c.maxUses) : "",
  startsAt: day(c?.startsAt ?? null),
  expiresAt: day(c?.expiresAt ?? null),
  isActive: c?.isActive ?? true,
});

// A code starts at the beginning of its first day and ends at the end of its last day
export const toPayload = (v: CouponValues) => ({
  code: v.code.trim().toUpperCase(),
  discountType: v.discountType,
  discountValue: Number(v.discountValue),
  minOrderAmount: num(v.minOrderAmount),
  maxUses: num(v.maxUses),
  startsAt: v.startsAt ? new Date(`${v.startsAt}T00:00:00`).toISOString() : null,
  expiresAt: v.expiresAt ? new Date(`${v.expiresAt}T23:59:59`).toISOString() : null,
  isActive: v.isActive,
});
