import type { Order } from "@/types";
import { formatMK } from "@/lib/format";

// The items of the order with the discount, the delivery note and the total
export default function OrderReceipt({ order }: { order: Order }) {
  return (
    <div className="space-y-2 rounded-xl border bg-white p-4 text-sm text-navy">
      {order.items.map((i) => (
        <div key={i.id} className="flex justify-between gap-3">
          <span>
            {i.productName}
            {i.variantLabel ? ` (${i.variantLabel})` : ""} x{i.quantity}
          </span>
          <span className="shrink-0">{formatMK(i.lineTotal)}</span>
        </div>
      ))}
      {Number(order.discountTotal) > 0 && (
        <div className="flex justify-between font-semibold text-green-600">
          <span>Discount</span>
          <span>-{formatMK(order.discountTotal)}</span>
        </div>
      )}
      <div className="flex justify-between border-t pt-2">
        <span>Delivery</span>
        <span className="text-muted-foreground">Agreed on WhatsApp</span>
      </div>
      <div className="flex justify-between text-base font-extrabold">
        <span>Total</span>
        <span className="text-orange-500">{formatMK(order.total)}</span>
      </div>
    </div>
  );
}
