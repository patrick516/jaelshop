import { AlertTriangle } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { formatMK } from "@/lib/format";
import type { ProfitData } from "./types";

// The four numbers on top of the Profit tab, with a warning when some sales have no cost price
export default function ProfitCards({ data }: { data: ProfitData }) {
  const t = data.totals;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sales (after discounts)" value={formatMK(t.revenue)} hint={`Discounts given: ${formatMK(data.discounts)}`} />
        <StatCard label="Cost of goods" value={formatMK(t.cost)} hint="What the sold items cost you." />
        <StatCard label="Gross profit" value={formatMK(t.profit)} hint="Sales minus cost." />
        <StatCard label="Profit margin" value={t.margin === null ? "-" : `${t.margin}%`} hint="Profit as a share of sales." />
      </div>
      {t.uncostedRevenue > 0 && (
        <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          {formatMK(t.uncostedRevenue)} of these sales had no cost price, so they are not counted in the profit. Set a cost price on those products. It applies to orders placed from then on.
        </p>
      )}
      <p className="text-xs text-muted-foreground">Gross profit does not include delivery, rent, transport or salaries.</p>
    </div>
  );
}
