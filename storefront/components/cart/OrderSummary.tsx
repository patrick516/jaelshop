import type { CartItem } from "@/store/cart";
import { formatMK } from "@/lib/format";

type Props = {
  items: CartItem[];
  subtotal: number;
  discount?: number;
  children?: React.ReactNode;
};

// The items and totals box. children is the space for the error message and the button
export default function OrderSummary({
  items,
  subtotal,
  discount = 0,
  children,
}: Props) {
  return (
    <div className="h-fit space-y-3 rounded-xl border bg-white p-4">
      <h2 className="font-extrabold text-navy">Order Summary</h2>
      {items.map((i) => (
        <div
          key={i.variantId}
          className="flex justify-between gap-3 text-sm text-navy"
        >
          <span className="min-w-0">
            {i.name}
            {i.variantLabel ? ` (${i.variantLabel})` : ""} x{i.quantity}
          </span>
          <span className="shrink-0">{formatMK(i.price * i.quantity)}</span>
        </div>
      ))}
      <div className="flex justify-between border-t pt-3 text-sm text-navy">
        <span>Subtotal</span>
        <span>{formatMK(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-sm font-semibold text-green-600">
          <span>Discount</span>
          <span>-{formatMK(discount)}</span>
        </div>
      )}
      <div className="flex justify-between text-sm text-navy">
        <span>Delivery</span>
        <span className="text-muted-foreground">Agreed on WhatsApp</span>
      </div>
      <div className="flex justify-between border-t pt-3 text-lg font-extrabold text-navy">
        <span>Total</span>
        <span className="text-orange-500">{formatMK(subtotal - discount)}</span>
      </div>
      {children}
    </div>
  );
}
