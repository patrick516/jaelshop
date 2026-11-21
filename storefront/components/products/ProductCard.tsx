"use client"; // uses the cart and a click handler

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { useCart } from "@/store/cart";
import { formatMK } from "@/lib/format";
import CardImage from "./CardImage";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const variants = product.variants.filter((v) => v.isActive);
  const single = variants.length === 1 ? variants[0] : null;
  const image = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const inStock = (v: (typeof variants)[number]) =>
    (v.inventory?.quantity ?? 0) > 0;
  const soldOut = !variants.some(inStock);
  const left = variants.reduce(
    (sum, v) => sum + (v.inventory?.quantity ?? 0),
    0,
  );

  const addToCart = () => {
    if (!single) return;
    const added = addItem({
      variantId: single.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantLabel:
        [single.size, single.color].filter(Boolean).join(" / ") || null,
      image: image?.url ?? null,
      price: Number(single.priceOverride ?? product.price),
      stock: single.inventory?.quantity ?? 0,
    });
    if (added === 0) toast.warning("All available are already in your cart");
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white">
      <CardImage product={product} />

      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold text-navy"
        >
          {product.name}
        </Link>
        <p className="font-bold text-orange-500">{formatMK(product.price)}</p>
        {!soldOut && left <= 5 && (
          <p className="text-xs font-semibold text-amber-600">
            Only {left} left
          </p>
        )}

        {/* mt-auto pushes the button to the bottom so cards in a row line up */}
        {soldOut ? (
          <button
            disabled
            className="mt-auto rounded-lg bg-muted py-2 text-xs font-semibold text-muted-foreground"
          >
            Out of stock
          </button>
        ) : single ? (
          <button
            onClick={addToCart}
            className="mt-auto flex items-center justify-center gap-1 rounded-lg bg-orange-500 py-2 text-xs font-semibold text-white active:scale-95"
          >
            <ShoppingCart size={14} /> Add to Cart
          </button>
        ) : (
          <Link
            href={`/product/${product.slug}`}
            className="mt-auto rounded-lg bg-navy py-2 text-center text-xs font-semibold text-white"
          >
            Choose options
          </Link>
        )}
      </div>
    </div>
  );
}
