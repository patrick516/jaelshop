export type SalesData = { totalOrders: number; totalSales: number; rows: { period: string; orders: number; sales: number }[] };
export type TopProductsData = { rows: { name: string; quantity: number; revenue: number }[] };
export type PaymentsData = { rows: { method: string; status: string; count: number; amount: number }[] };
export type StockData = { units: number; costValue: number; retailValue: number; lowStockVariants: number };

// Every report that depends on dates gets these
export type RangeProps = { from: string; to: string };
