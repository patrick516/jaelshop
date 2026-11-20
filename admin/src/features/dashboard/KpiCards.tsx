import { Clock, Coins, ShoppingCart, TrendingUp } from "lucide-react";
import { formatMK } from "@/lib/format";
import KpiCard from "./KpiCard";
import type { DashboardData } from "./types";

const number = (n: number) => n.toLocaleString("en-US");

type Props = { data: DashboardData; profit: { profit: number; margin: number | null } | null };

// The four cards at the top. Customers are not counted because shoppers order without an account.
// Gross profit comes from the profit report and shows "-" until it has loaded
export default function KpiCards({ data, profit }: Props) {
  const { cards } = data;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Total Orders" value={number(cards.orders.value)} change={cards.orders.change} Icon={ShoppingCart} tone="navy" />
      <KpiCard label="Pending Orders" value={number(data.pendingOrders)} Icon={Clock} tone="orange" />
      <KpiCard label="Total Sales" value={formatMK(cards.sales.value)} change={cards.sales.change} Icon={Coins} tone="navy" />
      <KpiCard label={profit?.margin != null ? `Gross Profit (${profit.margin}% margin)` : "Gross Profit"} value={profit ? formatMK(profit.profit) : "-"} Icon={TrendingUp} tone="white" />
    </div>
  );
}
