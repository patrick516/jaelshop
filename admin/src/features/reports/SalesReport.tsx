import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import QueryState from "@/components/shared/QueryState";
import StatCard from "@/components/shared/StatCard";
import { useFetch } from "@/hooks/useFetch";
import { formatMK } from "@/lib/format";
import type { RangeProps, SalesData } from "./types";

const compact = new Intl.NumberFormat("en", { notation: "compact" }); // 3000000 becomes "3M"

// Total sales, number of orders and a bar chart per day or month
export default function SalesReport({ from, to }: RangeProps) {
  const [group, setGroup] = useState<"day" | "month">("day");
  const { data, error, loading } = useFetch<SalesData>(`/reports/sales?from=${from}&to=${to}&group=${group}`);
  if (!data) return <QueryState loading={loading} error={error} />;

  const rows = data.rows.map((r) => ({
    label: new Date(r.period).toLocaleDateString("en-GB", group === "month" ? { month: "short", year: "2-digit" } : { day: "numeric", month: "short" }),
    sales: r.sales,
  }));
  const average = data.totalOrders ? data.totalSales / data.totalOrders : 0;
  const axis = { tickLine: false, axisLine: false, fontSize: 12 } as const;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total sales" value={formatMK(data.totalSales)} hint="Cancelled and refunded orders are not counted." />
        <StatCard label="Orders" value={data.totalOrders.toLocaleString("en-US")} />
        <StatCard label="Average order" value={formatMK(Math.round(average))} />
      </div>
      <div className="rounded-xl border bg-white p-4">
        <div className="mb-3 flex gap-2">
          <Button size="sm" variant={group === "day" ? "default" : "outline"} onClick={() => setGroup("day")}>
            Daily
          </Button>
          <Button size="sm" variant={group === "month" ? "default" : "outline"} onClick={() => setGroup("month")}>
            Monthly
          </Button>
        </div>
        {rows.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">No sales in this period</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" {...axis} />
                <YAxis tickFormatter={(v: number) => compact.format(v)} {...axis} />
                <Tooltip formatter={(v) => formatMK(Number(v))} />
                <Bar dataKey="sales" name="Sales" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
