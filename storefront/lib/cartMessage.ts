import type { CartItem } from "@/store/cart";
import { formatMK } from "@/lib/format";

// The WhatsApp message that lists every item in the cart
export function buildCartMessage(
  items: CartItem[],
  storeName: string,
  subtotal: number,
): string {
  return [
    `Hello ${storeName}, I would like to order:`,
    "",
    ...items.map(
      (i) =>
        `- ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""} x${i.quantity} = ${formatMK(i.price * i.quantity)}`,
    ),
    "",
    `Total: ${formatMK(subtotal)}`,
    "Delivery: please tell me the cost for my area.",
  ].join("\n");
}
