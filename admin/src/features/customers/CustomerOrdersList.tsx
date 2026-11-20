import { Button } from "@/components/ui/button";
import { formatDate, formatMK } from "@/lib/format";
import OrderStatusBadge from "@/features/orders/OrderStatusBadge";
import type { CustomerOrder } from "./types";

type Props = { orders: CustomerOrder[]; onPay: (order: CustomerOrder) => void };

// A customer's orders with what is paid and what is still owed on each
export default function CustomerOrdersList({ orders, onPay }: Props) {
  if (orders.length === 0) return <p className="py-6 text-center text-sm text-muted-foreground">No orders linked to this customer yet. Link orders from the Orders page.</p>;

  return (
    <div className="divide-y rounded-xl border">
      {orders.map((o) => (
        <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-3 text-sm">
          <div>
            <p className="flex items-center gap-2 font-semibold text-navy">
              {o.orderNumber} <OrderStatusBadge status={o.status} />
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(o.createdAt)} · Total {formatMK(o.total)} · Paid {formatMK(o.paid)}
            </p>
          </div>
          {o.balance > 0 ? (
            <div className="flex items-center gap-3">
              <span className="font-bold text-destructive">{formatMK(o.balance)}</span>
              <Button size="sm" onClick={() => onPay(o)} className="bg-orange-500 hover:bg-orange-600">
                Record payment
              </Button>
            </div>
          ) : (
            <span className="text-xs font-semibold text-green-600">Cleared</span>
          )}
        </div>
      ))}
    </div>
  );
}
