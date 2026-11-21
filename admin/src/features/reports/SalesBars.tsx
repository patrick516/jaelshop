import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMK } from "@/lib/format";
import { tipDate } from "@/lib/dates";
import ChartTooltip from "@/components/shared/ChartTooltip";
import type { SalesData } from "./types";

const compact = new Intl.NumberFormat("en", { notation: "compact" }); // 3000000 becomes "3M"

// Sales for each day (or month) as bars
export default function SalesBars({
  rows,
  monthly,
}: {
  rows: SalesData["rows"];
  monthly: boolean;
}) {
  if (rows.length === 0)
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        No sales in this period
      </p>
    );

  const data = rows.map((r) => ({
    label: new Date(r.period).toLocaleDateString(
      "en-GB",
      monthly
        ? { month: "short", year: "2-digit" }
        : { day: "numeric", month: "short" },
    ),
    sales: r.sales,
    tip: tipDate(r.period, monthly),
  }));
  const axis = { tickLine: false, axisLine: false, fontSize: 12 } as const;

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" {...axis} />
          <YAxis tickFormatter={(v: number) => compact.format(v)} {...axis} />
          <Tooltip
            cursor={false}
            wrapperStyle={{ outline: "none" }}
            content={<ChartTooltip format={(v) => formatMK(v)} />}
          />
          <Bar
            dataKey="sales"
            name="Sales"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
