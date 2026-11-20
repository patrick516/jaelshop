import { Clock, Coins, Package, ShoppingCart } from "lucide-react";
import { formatMK } from "@/lib/format";
import KpiCard from "./KpiCard";
import type { DashboardData } from "./types";

const number = (n: number) => n.toLocaleString("en-US");

// The four cards at the top. Customers are not counted because shoppers order without an account
export default function KpiCards({ data }: { data: DashboardData }) {
  const { cards } = data;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Total Orders" value={number(cards.orders.value)} change={cards.orders.change} Icon={ShoppingCart} tone="navy" />
      <KpiCard label="Pending Orders" value={number(data.pendingOrders)} Icon={Clock} tone="orange" />
      <KpiCard label="Total Sales" value={formatMK(cards.sales.value)} change={cards.sales.change} Icon={Coins} tone="navy" />
      <KpiCard label="Products" value={number(cards.products.value)} change={cards.products.change} Icon={Package} tone="white" />
    </div>
  );
}
