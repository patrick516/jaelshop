import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData } from "./types";

const compact = new Intl.NumberFormat("en", { notation: "compact" }); // 3000000 becomes "3M"

type Props = { points: DashboardData["salesOverview"]; monthly: boolean };

// Sales (MK, left axis) and number of orders (right axis) over the chosen period
export default function SalesChart({ points, monthly }: Props) {
  const data = points.map((p) => ({
    label: new Date(p.date).toLocaleDateString("en-GB", monthly ? { month: "short", year: "2-digit" } : { day: "numeric", month: "short" }),
    sales: p.sales,
    orders: p.orders,
  }));
  const axis = { tickLine: false, axisLine: false, fontSize: 12 } as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-navy">Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">No sales in this period yet</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" {...axis} />
                <YAxis yAxisId="sales" tickFormatter={(v: number) => compact.format(v)} {...axis} />
                <YAxis yAxisId="orders" orientation="right" allowDecimals={false} {...axis} />
                <Tooltip formatter={(v) => Number(v).toLocaleString("en-US")} />
                <Legend />
                <Line yAxisId="sales" type="monotone" dataKey="sales" name="Sales (MK)" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={data.length < 3} />
                <Line yAxisId="orders" type="monotone" dataKey="orders" name="Orders" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={data.length < 3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
