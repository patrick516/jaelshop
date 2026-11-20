import QueryState from "@/components/shared/QueryState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFetch } from "@/hooks/useFetch";
import { formatMK } from "@/lib/format";
import type { RangeProps, TopProductsData } from "./types";

// The best sellers by units sold
export default function TopProductsReport({ from, to }: RangeProps) {
  const { data, error, loading } = useFetch<TopProductsData>(`/reports/top-products?from=${from}&to=${to}&limit=10`);
  if (!data) return <QueryState loading={loading} error={error} />;

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Units sold</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                No sales in this period
              </TableCell>
            </TableRow>
          ) : (
            data.rows.map((r, i) => (
              <TableRow key={r.name}>
                <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="font-semibold text-navy">{r.name}</TableCell>
                <TableCell>{r.quantity}</TableCell>
                <TableCell className="text-right font-semibold">{formatMK(r.revenue)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
