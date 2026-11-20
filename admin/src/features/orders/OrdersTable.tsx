import { Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatMK } from "@/lib/format";
import { methodLabel, sourceLabel } from "@/lib/labels";
import OrderStatusBadge from "./OrderStatusBadge";
import type { OrderSummary } from "./types";

type Props = { items: OrderSummary[]; loading: boolean; onOpen: (id: string) => void };

// The orders table. Clicking a row opens the order
export default function OrdersTable({ items, loading, onOpen }: Props) {
  const message = (text: string) => (
    <TableRow>
      <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
        {text}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden sm:table-cell">Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="hidden md:table-cell">Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead className="text-right">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : items.length === 0
              ? message("No orders found")
              : items.map((o) => {
                  const pay = o.payments[0];
                  return (
                    <TableRow key={o.id} className="cursor-pointer" onClick={() => onOpen(o.id)}>
                      <TableCell>
                        <p className="font-semibold text-navy">{o.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">{sourceLabel[o.source] ?? o.source}</p>
                      </TableCell>
                      <TableCell>
                        <p>{o.shippingName}</p>
                        <p className="text-xs text-muted-foreground">{o.shippingPhone}</p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{o._count.items}</TableCell>
                      <TableCell className="font-semibold">{formatMK(o.total)}</TableCell>
                      <TableCell className="hidden md:table-cell">{pay ? (methodLabel[pay.method] ?? pay.method) : "-"}</TableCell>
                      <TableCell>
                        <OrderStatusBadge status={o.status} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{formatDate(o.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Eye size={18} className="ml-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  );
                })}
        </TableBody>
      </Table>
    </div>
  );
}
