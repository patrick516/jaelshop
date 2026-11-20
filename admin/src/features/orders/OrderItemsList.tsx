import { formatMK } from "@/lib/format";
import type { OrderDetail } from "./types";

// The items of an order with subtotal, delivery fee and total
export default function OrderItemsList({ order }: { order: OrderDetail }) {
  return (
    <div className="space-y-2 rounded-xl border p-4 text-sm">
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
      {Number(order.discountTotal) > 0 && (
        <div className="flex justify-between font-semibold text-green-600">
          <span>Discount</span>
          <span>-{formatMK(order.discountTotal)}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span>Delivery fee</span>
        <span>{formatMK(order.deliveryFee)}</span>
      </div>
      <div className="flex justify-between text-base font-extrabold text-navy">
        <span>Total</span>
        <span className="text-orange-500">{formatMK(order.total)}</span>
      </div>
    </div>
  );
}
