import { Star } from "lucide-react";
import type { Product } from "@/types";

// The review cards. Nothing is drawn when there are no reviews yet
export default function ProductReviews({ reviews }: { reviews: NonNullable<Product["reviews"]> }) {
  if (reviews.length === 0) return null;

  return (
    <div>
      <h2 className="mb-2 font-extrabold text-navy">Reviews</h2>
      <div className="space-y-2">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-xl border bg-white p-3 text-sm">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={14} className={n <= r.rating ? "fill-orange-500 text-orange-500" : "text-muted-foreground/40"} />
              ))}
            </div>
            {r.comment && <p className="mt-1 text-navy">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
