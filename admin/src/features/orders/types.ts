import type { Opt } from "@/components/shared/OptionSelect";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

// One row of the orders table
export type OrderSummary = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  source: string;
  total: string;
  shippingName: string;
  shippingPhone: string;
  createdAt: string;
  _count: { items: number };
  payments: { method: string; status: string }[];
};

export type OrderLine = {
  id: string;
  productName: string;
  variantLabel: string | null;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
};
export type Payment = {
  id: string;
  method: string;
  status: string;
  amount: string;
  phoneNumber: string | null;
  transactionRef: string | null;
};

// One whole order, as shown in the pop-up
export type OrderDetail = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  source: string;
  subtotal: string;
  deliveryFee: string;
  discountTotal: string;
  total: string;
  listTotal: string | null;
  soldAt: string | null;
  shippingName: string;
  shippingPhone: string;
  shippingDistrict: string;
  shippingArea: string;
  shippingAddress: string | null;
  notes: string | null;
  createdAt: string;
  items: OrderLine[];
  payments: Payment[];
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  } | null; // set when linked for a loan
};

export const STATUS_OPTIONS: Opt[] = (
  [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ] as const
).map((s) => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase() }));

// These orders can no longer be changed (the backend refuses it)
export const CLOSED: OrderStatus[] = ["CANCELLED", "REFUNDED"];
