"use client"; // uses the cart and a click handler

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/store/cart";
import { formatMK } from "@/lib/format";
import CardImage from "./CardImage";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const variants = product.variants.filter((v) => v.isActive);
  // A product with exactly one version can be added straight away. Others need a size/colour choice
  const single = variants.length === 1 ? variants[0] : null;
  const image = product.images.find((i) => i.isPrimary) ?? product.images[0]; // main picture, or the first one
  const inStock = (v: (typeof variants)[number]) => (v.inventory?.quantity ?? 0) > 0;
  const soldOut = !variants.some(inStock); // true when every version is out of stock

  const addToCart = () => {
    if (!single) return;
    addItem({
      variantId: single.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantLabel: [single.size, single.color].filter(Boolean).join(" / ") || null, // "A4 / Blue", or null when empty
      image: image?.url ?? null,
      price: Number(single.priceOverride ?? product.price), // this version's own price wins if it has one
    });
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white">
      <CardImage product={product} />

      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link href={`/product/${product.slug}`} className="line-clamp-2 text-sm font-semibold text-navy">
          {product.name}
        </Link>
        <p className="font-bold text-orange-500">{formatMK(product.price)}</p>

        {/* mt-auto pushes the button to the bottom so cards in a row line up */}
        {soldOut ? (
          <button disabled className="mt-auto rounded-lg bg-muted py-2 text-xs font-semibold text-muted-foreground">
            Out of stock
          </button>
        ) : single ? (
          <button onClick={addToCart} className="mt-auto flex items-center justify-center gap-1 rounded-lg bg-orange-500 py-2 text-xs font-semibold text-white active:scale-95">
            <ShoppingCart size={14} /> Add to Cart
          </button>
        ) : (
          <Link href={`/product/${product.slug}`} className="mt-auto rounded-lg bg-navy py-2 text-center text-xs font-semibold text-white">
            Choose options
          </Link>
        )}
      </div>
    </div>
  );
}
