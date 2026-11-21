import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData } from "./types";
import { formatMK } from "@/lib/format";
import { tipDate } from "@/lib/dates";
import ChartTooltip from "@/components/shared/ChartTooltip";

const compact = new Intl.NumberFormat("en", { notation: "compact" }); // 3000000 becomes "3M"

type Props = { points: DashboardData["salesOverview"]; monthly: boolean };

// Sales (MK, left axis) as rounded bars, orders (right axis) as a line, over the chosen period
export default function SalesChart({ points, monthly }: Props) {
  const data = points.map((p) => ({
    label: new Date(p.date).toLocaleDateString(
      "en-GB",
      monthly
        ? { month: "short", year: "2-digit" }
        : { day: "numeric", month: "short" },
    ),
    sales: p.sales,
    orders: p.orders,
    tip: tipDate(p.date, monthly),
  }));
  const axis = { tickLine: false, axisLine: false, fontSize: 12 } as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-navy">Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No sales in this period yet
          </p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" {...axis} />
                <YAxis
                  yAxisId="sales"
                  tickFormatter={(v: number) => compact.format(v)}
                  {...axis}
                />
                <YAxis
                  yAxisId="orders"
                  orientation="right"
                  allowDecimals={false}
                  {...axis}
                />
                <Tooltip
                  wrapperStyle={{ outline: "none" }}
                  content={
                    <ChartTooltip
                      format={(v, name) =>
                        name === "Orders"
                          ? v.toLocaleString("en-US")
                          : formatMK(v)
                      }
                    />
                  }
                />
                <Legend />
                <Bar
                  yAxisId="sales"
                  dataKey="sales"
                  name="Sales (MK)"
                  fill="hsl(var(--chart-1))"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={64}
                />
                <Line
                  yAxisId="orders"
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={data.length < 3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
