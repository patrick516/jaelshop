import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/types";
import { formatMK } from "@/lib/format";

// Category, name, brand, rating and price. price comes from the chosen version
export default function ProductHeader({ product, price }: { product: Product; price: number }) {
  const reviews = product.reviews ?? [];
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const was = product.compareAtPrice ? Number(product.compareAtPrice) : 0; // old price

  return (
    <div className="space-y-3">
      <div>
        <Link href={`/shop?category=${product.category.slug}`} className="text-xs font-semibold uppercase tracking-wide text-orange-500">
          {product.category.name}
        </Link>
        <h1 className="mt-1 text-2xl font-extrabold text-navy">{product.name}</h1>
        {product.brand && <p className="text-sm text-muted-foreground">by {product.brand.name}</p>}
        {reviews.length > 0 && (
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <Star size={14} className="fill-orange-500 text-orange-500" />
            <span className="font-semibold text-navy">{average.toFixed(1)}</span> ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
          </p>
        )}
      </div>
      <div className="flex items-baseline gap-3">
        <p className="text-3xl font-extrabold text-orange-500">{formatMK(price)}</p>
        {was > price && <p className="text-sm text-muted-foreground line-through">{formatMK(was)}</p>}
      </div>
    </div>
  );
}
