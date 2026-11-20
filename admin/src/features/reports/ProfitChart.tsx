import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMK } from "@/lib/format";
import type { ProfitData } from "./types";

const compact = new Intl.NumberFormat("en", { notation: "compact" }); // 3000000 becomes "3M"

// Profit for each day (or month) of the chosen period
export default function ProfitChart({ points, monthly }: { points: ProfitData["byPeriod"]; monthly: boolean }) {
  if (points.length === 0) return null;
  const data = points.map((p) => ({
    label: new Date(p.period).toLocaleDateString("en-GB", monthly ? { month: "short", year: "2-digit" } : { day: "numeric", month: "short" }),
    profit: p.profit,
  }));
  const axis = { tickLine: false, axisLine: false, fontSize: 12 } as const;

  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="mb-3 font-extrabold text-navy">Profit over time</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" {...axis} />
            <YAxis tickFormatter={(v: number) => compact.format(v)} {...axis} />
            <Tooltip formatter={(v) => formatMK(Number(v))} />
            <Bar dataKey="profit" name="Profit" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
