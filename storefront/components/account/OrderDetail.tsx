"use client"; // needs the login and loads data in the browser

import Link from "next/link";
import type { Order } from "@/types";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { useLoad } from "@/hooks/useLoad";
import { formatDate, formatMK } from "@/lib/format";
import { methodLabel } from "@/lib/labels";
import LoadState from "@/components/shared/LoadState";
import OrderStatusBadge from "@/components/shared/OrderStatusBadge";

// One order: status, items, totals, payment and delivery details
export default function OrderDetail({ id }: { id: string }) {
  const allowed = useRequireLogin();
  const { data: order, loading, error } = useLoad<Order>(`/orders/${id}`);

  if (!allowed || !order) return <LoadState loading={loading || !allowed} error={error} />;

  const payment = order.payments[0];
  const box = "space-y-2 rounded-xl border bg-white p-4 text-sm text-navy";

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link href="/orders" className="text-sm font-semibold text-orange-500">
        ← My Orders
      </Link>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">{order.orderNumber}</h1>
          <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className={box}>
        {order.items.map((i) => (
          <div key={i.id} className="flex justify-between gap-3">
            <span>
              {i.productName}
              {i.variantLabel ? ` (${i.variantLabel})` : ""} x{i.quantity}
            </span>
            <span className="shrink-0">{formatMK(i.lineTotal)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t pt-2">
          <span>Subtotal</span>
          <span>{formatMK(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery fee</span>
          <span>{formatMK(order.deliveryFee)}</span>
        </div>
        <div className="flex justify-between text-base font-extrabold">
          <span>Total</span>
          <span className="text-orange-500">{formatMK(order.total)}</span>
        </div>
      </div>

      {payment && (
        <div className={box}>
          <p className="font-extrabold">Payment</p>
          <p>
            {methodLabel[payment.method] ?? payment.method} ({payment.status.toLowerCase()})
          </p>
        </div>
      )}

      <div className={box}>
        <p className="font-extrabold">Delivery</p>
        <p>
          {order.shippingName}, {order.shippingPhone}
        </p>
        <p>
          {[order.shippingAddress, order.shippingArea, order.shippingDistrict].filter(Boolean).join(", ")}
        </p>
      </div>
    </div>
  );
}
