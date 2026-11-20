import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData } from "./types";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

// A donut of sales by category, with the legend beside it
export default function TopCategories({ categories }: { categories: DashboardData["topCategories"] }) {
  const slices = categories.map((c, i) => ({ ...c, fill: COLORS[i % COLORS.length] })); // Pie reads "fill" from each item
  const top = slices[0];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg text-navy">Top Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {!top ? (
          <p className="py-16 text-center text-sm text-muted-foreground">No sales in this period yet</p>
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col xl:flex-row">
            <div className="relative h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={slices} dataKey="share" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={2} stroke="none" />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-navy">{top.share}%</span>
                <span className="max-w-[80px] truncate text-xs text-muted-foreground">{top.name}</span>
              </div>
            </div>
            <ul className="w-full space-y-2 text-sm">
              {slices.map((c) => (
                <li key={c.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: c.fill }} />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="font-semibold">{c.share}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
