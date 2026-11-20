import QueryState from "@/components/shared/QueryState";
import StatCard from "@/components/shared/StatCard";
import { useFetch } from "@/hooks/useFetch";
import { formatMK } from "@/lib/format";
import type { StockData } from "./types";
import ExportMenu from "./ExportMenu";
import { stockDoc } from "./docs";

export default function StockReport() {
  const { data, error, loading } = useFetch<StockData>("/reports/stock");
  if (!data) return <QueryState loading={loading} error={error} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ExportMenu doc={stockDoc(data)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Units in stock"
          value={data.units.toLocaleString("en-US")}
        />
        <StatCard
          label="Worth at selling price"
          value={formatMK(data.retailValue)}
        />
        <StatCard
          label="Worth at cost price"
          value={formatMK(data.costValue)}
        />
        <StatCard
          label="Low stock items"
          value={String(data.lowStockVariants)}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        The cost value only counts products where you entered a cost price.
        Stock value is always as of today, whatever dates are chosen.
      </p>
    </div>
  );
}
