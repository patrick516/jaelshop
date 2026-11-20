export type CustomerRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
  orderCount: number;
  ordered: number; // everything they ordered (cancelled orders are not counted)
  paid: number;
  balance: number; // what they still owe
};

export type CustomerOrder = { id: string; orderNumber: string; status: string; total: string; createdAt: string; paid: number; balance: number };
export type CustomerDetail = CustomerRow & { orders: CustomerOrder[] };
export type Summary = { customerCount: number; owingCount: number; totalOwed: number };

export const fullName = (c: { firstName: string; lastName: string }): string => [c.firstName, c.lastName].filter(Boolean).join(" ");
