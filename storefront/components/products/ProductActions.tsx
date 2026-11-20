"use client"; // uses the cart and a click handler

import { useState } from "react";
import { Check, MessageCircle, ShoppingCart } from "lucide-react";
import type { Product, Settings } from "@/types";
import type { VariantSelection } from "@/hooks/useVariantSelection";
import { useCart } from "@/store/cart";
import { formatMK } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";

type Props = { product: Product; settings: Settings; sel: VariantSelection };

// The two main buttons: Add to Cart and Order via WhatsApp
export default function ProductActions({ product, settings, sel }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false); // true for 1.5 seconds after Add to Cart
  const { selected, stock, qty, price, label } = sel;
  const image = (product.images.find((i) => i.isPrimary) ?? product.images[0])?.url ?? null;

  const addToCart = () => {
    if (!selected || stock === 0) return;
    addItem({ variantId: selected.id, productId: product.id, slug: product.slug, name: product.name, variantLabel: label || null, image, price }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // The message WhatsApp opens with, ready to send
  const message = [
    `Hello ${settings.storeName}, I would like to order:`,
    "",
    `${product.name}${label ? ` (${label})` : ""}`,
    `Quantity: ${qty}`,
    `Price: ${formatMK(price)} each`,
    `Total: ${formatMK(price * qty)}`,
  ].join("\n");

  return (
    <div className="space-y-2">
      <button
        onClick={addToCart}
        disabled={!selected || stock === 0}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-orange-500 py-3 font-bold text-white active:scale-95 disabled:bg-muted disabled:text-muted-foreground"
      >
        {added ? <Check size={18} /> : <ShoppingCart size={18} />}
        {added ? "Added to cart" : "Add to Cart"}
      </button>
      <a
        href={whatsappLink(settings.whatsappNumber, message)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 font-bold text-white active:scale-95"
      >
        <MessageCircle size={18} /> Order via WhatsApp
      </a>
    </div>
  );
}
