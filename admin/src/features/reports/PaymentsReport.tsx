import QueryState from "@/components/shared/QueryState";
import StatCard from "@/components/shared/StatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFetch } from "@/hooks/useFetch";
import { formatMK } from "@/lib/format";
import { methodLabel } from "@/lib/labels";
import PaymentStatusBadge from "@/features/payments/PaymentStatusBadge";
import type { PaymentsData, RangeProps } from "./types";

// Payments grouped by method and status
export default function PaymentsReport({ from, to }: RangeProps) {
  const { data, error, loading } = useFetch<PaymentsData>(`/reports/payments?from=${from}&to=${to}`);
  if (!data) return <QueryState loading={loading} error={error} />;

  const total = (status: string) => data.rows.filter((r) => r.status === status).reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Received (paid)" value={formatMK(total("PAID"))} />
        <StatCard label="Still waiting (pending)" value={formatMK(total("PENDING"))} />
      </div>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payments</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  No payments in this period
                </TableCell>
              </TableRow>
            ) : (
              data.rows.map((r) => (
                <TableRow key={r.method + r.status}>
                  <TableCell className="font-semibold text-navy">{methodLabel[r.method] ?? r.method}</TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={r.status} />
                  </TableCell>
                  <TableCell>{r.count}</TableCell>
                  <TableCell className="text-right font-semibold">{formatMK(r.amount)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
