import type { OrderDetail } from "./types";

const round2 = (n: number) => Math.round(n * 100) / 100;

// How much of the order has been paid. Only payments marked PAID count
export const paidTotal = (payments: OrderDetail["payments"]): number => round2(payments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + Number(p.amount), 0));

// What the buyer still owes on this order
export const balanceOf = (order: OrderDetail): number => round2(Number(order.total) - paidTotal(order.payments));
