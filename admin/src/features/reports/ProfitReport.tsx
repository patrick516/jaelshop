import QueryState from "@/components/shared/QueryState";
import { useFetch } from "@/hooks/useFetch";
import { daysBetween } from "@/lib/dates";
import ExportMenu from "./ExportMenu";
import ProfitCards from "./ProfitCards";
import ProfitChart from "./ProfitChart";
import ProfitTable from "./ProfitTable";
import { profitDoc } from "./profitDoc";
import type { ProfitData, RangeProps } from "./types";

// Gross profit for the chosen dates: sales after discounts minus what the goods cost you
export default function ProfitReport({ from, to }: RangeProps) {
  const monthly = daysBetween(from, to) > 92; // long periods are grouped by month
  const { data, error, loading } = useFetch<ProfitData>(`/reports/profit?from=${from}&to=${to}&group=${monthly ? "month" : "day"}`);
  if (!data) return <QueryState loading={loading} error={error} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ExportMenu doc={profitDoc(data, from, to, monthly)} />
      </div>
      <ProfitCards data={data} />
      <ProfitChart points={data.byPeriod} monthly={monthly} />
      <ProfitTable rows={data.byProduct} />
    </div>
  );
}
