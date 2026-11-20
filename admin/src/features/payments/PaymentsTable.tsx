import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatMK } from "@/lib/format";
import { methodLabel } from "@/lib/labels";
import PaymentStatusBadge from "./PaymentStatusBadge";
import type { PaymentRow } from "./types";

type Props = { items: PaymentRow[]; loading: boolean; onUpdate: (p: PaymentRow) => void };

// The payments table with a loading state and an empty state
export default function PaymentsTable({ items, loading, onUpdate }: Props) {
  const message = (content: React.ReactNode) => (
    <TableRow>
      <TableCell colSpan={7}>{content}</TableCell>
    </TableRow>
  );

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden md:table-cell">Reference</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? message(<Skeleton className="h-12 w-full" />)
            : items.length === 0
              ? message(<p className="py-8 text-center text-muted-foreground">No payments found</p>)
              : items.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <p className="font-semibold text-navy">{p.order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{p.order.shippingName}</p>
                    </TableCell>
                    <TableCell>
                      <p>{methodLabel[p.method] ?? p.method}</p>
                      {p.phoneNumber && <p className="text-xs text-muted-foreground">{p.phoneNumber}</p>}
                    </TableCell>
                    <TableCell className="font-semibold">{formatMK(p.amount)}</TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground md:table-cell">{p.transactionRef ?? "-"}</TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={p.status} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDate(p.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => onUpdate(p)}>
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
        </TableBody>
      </Table>
    </div>
  );
}
