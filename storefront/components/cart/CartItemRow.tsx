import Link from "next/link";
import { ImageOff, Trash2 } from "lucide-react";
import type { CartItem } from "@/store/cart";
import { formatMK } from "@/lib/format";
import QuantityStepper from "@/components/shared/QuantityStepper";

type Props = { item: CartItem; onQuantity: (n: number) => void; onRemove: () => void };

// One line of the cart: picture, name, version, price, stepper and a trash button
export default function CartItemRow({ item, onQuantity, onRemove }: Props) {
  return (
    <div className="flex gap-3 rounded-xl border bg-white p-3">
      <Link href={`/product/${item.slug}`} className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-secondary">
        {item.image ? <img src={item.image} alt={item.name} className="h-full w-full rounded-lg object-contain" /> : <ImageOff size={24} className="text-muted-foreground" />}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${item.slug}`} className="line-clamp-2 text-sm font-semibold text-navy">
            {item.name}
          </Link>
          <button aria-label="Remove" onClick={onRemove} className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground">
            <Trash2 size={16} />
          </button>
        </div>
        {item.variantLabel && <p className="text-xs text-muted-foreground">{item.variantLabel}</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="font-bold text-orange-500">{formatMK(item.price * item.quantity)}</p>
          {/* The stepper stops at 1. The trash button removes the line */}
          <QuantityStepper value={item.quantity} onChange={onQuantity} />
        </div>
      </div>
    </div>
  );
}
