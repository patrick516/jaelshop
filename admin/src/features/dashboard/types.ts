export type Card = { value: number; change: number }; // change is the % compared with the period before

// What GET /dashboard returns
export type DashboardData = {
  days: number;
  cards: { orders: Card; customers: Card; sales: Card; products: Card };
  salesOverview: { date: string; sales: number; orders: number }[];
  topCategories: { name: string; sales: number; share: number }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    customer: string;
    items: number;
    total: string;
    paymentMethod: string | null;
    status: string;
    createdAt: string;
  }[];
  pendingOrders: number;
  staleHours: number; // the limit set in Settings
  staleCount: number; // pending orders older than the limit
  stalePending: {
    id: string;
    orderNumber: string;
    customer: string;
    phone: string;
    items: number;
    total: string;
    source: string;
    createdAt: string;
    hoursPending: number;
  }[];
  lowStockCount: number;
};

export const RANGES = [
  { days: 7, label: "7D" },
  { days: 30, label: "30D" },
  { days: 90, label: "90D" },
  { days: 365, label: "1Y" },
];
