import type { CartItem } from "@/store/cart";
import { formatMK } from "@/lib/format";

// The WhatsApp message that lists every item in the cart
export function buildCartMessage(items: CartItem[], storeName: string, subtotal: number, deliveryFee: number): string {
  return [
    `Hello ${storeName}, I would like to order:`,
    "",
    ...items.map((i) => `- ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""} x${i.quantity} = ${formatMK(i.price * i.quantity)}`),
    "",
    `Subtotal: ${formatMK(subtotal)}`,
    `Delivery: ${formatMK(deliveryFee)}`,
    `Total: ${formatMK(subtotal + deliveryFee)}`,
  ].join("\n");
}
