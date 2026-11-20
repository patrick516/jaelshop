import Link from "next/link";
import type { Order } from "@/types";
import { formatDate, formatMK } from "@/lib/format";
import OrderStatusBadge from "@/components/shared/OrderStatusBadge";

// One row of the My Orders list. Tapping it opens the order
export default function OrderCard({ order }: { order: Order }) {
  const count = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Link href={`/orders/${order.id}`} className="block space-y-2 rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-extrabold text-navy">{order.orderNumber}</p>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-navy">
          {count} {count === 1 ? "item" : "items"}
        </span>
        <span className="font-bold text-orange-500">{formatMK(order.total)}</span>
      </div>
    </Link>
  );
}
