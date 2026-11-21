import { useState } from "react";
import { Button } from "@/components/ui/button";
import QueryState from "@/components/shared/QueryState";
import StatCard from "@/components/shared/StatCard";
import { useFetch } from "@/hooks/useFetch";
import { formatMK } from "@/lib/format";
import ExportMenu from "./ExportMenu";
import SalesBars from "./SalesBars";
import { salesDoc } from "./docs";
import type { RangeProps, SalesData } from "./types";

// Total sales, number of orders and a bar chart per day or month
export default function SalesReport({ from, to }: RangeProps) {
  const [group, setGroup] = useState<"day" | "month">("day");
  const { data, error, loading } = useFetch<SalesData>(`/reports/sales?from=${from}&to=${to}&group=${group}`);
  if (!data) return <QueryState loading={loading} error={error} />;

  const average = data.totalOrders ? data.totalSales / data.totalOrders : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ExportMenu doc={salesDoc(data, from, to, group === "month")} />
      </div>
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
        <SalesBars rows={data.rows} monthly={group === "month"} />
      </div>
    </div>
  );
}
