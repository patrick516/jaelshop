import type { Opt } from "@/components/shared/OptionSelect";
import { methodLabel } from "@/lib/labels";

// What the update pop-up needs. Both the payments table and an order's payment fit this
export type PaymentEdit = { id: string; method: string; status: string; amount: string; transactionRef: string | null };

// One row of the payments table
export type PaymentRow = PaymentEdit & {
  phoneNumber: string | null;
  paidAt: string | null;
  createdAt: string;
  order: { orderNumber: string; shippingName: string; total: string };
};

export const PAY_STATUS_OPTIONS: Opt[] = (["PENDING", "PAID", "FAILED", "REFUNDED"] as const).map((s) => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase() }));
export const METHOD_OPTIONS: Opt[] = Object.entries(methodLabel).map(([value, label]) => ({ value, label }));
