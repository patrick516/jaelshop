"use client"; // uses the cart and a click handler

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, ShoppingCart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa"; // Official WhatsApp Icon
import type { Product, Settings } from "@/types";
import type { VariantSelection } from "@/hooks/useVariantSelection";
import { useCart } from "@/store/cart";

type Props = { product: Product; settings: Settings; sel: VariantSelection };

export default function ProductActions({ product, sel }: Props) {
  const { items, addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false); // true for 1.5 seconds after Add to Cart
  const { selected, stock, qty, price, label } = sel;
  const image =
    (product.images.find((i) => i.isPrimary) ?? product.images[0])?.url ?? null;
  const inCart = items.find((i) => i.variantId === selected?.id)?.quantity ?? 0;
  const full = !!selected && stock > 0 && inCart >= stock; // everything that is available is already in the cart

  const addToCart = () => {
    if (!selected || stock === 0 || full) return;
    const done = addItem(
      {
        variantId: selected.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        variantLabel: label || null,
        image,
        price,
        stock,
      },
      qty,
    );
    if (done < qty)
      toast.warning(
        `Only ${stock} available${inCart ? `, and you already have ${inCart} in your cart` : ""}. We added ${done}.`,
      );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Order via WhatsApp: put the chosen item in the cart and go to checkout.
  // The checkout saves the order in the system first (as Pending) and only then opens WhatsApp
  const orderViaWhatsApp = () => {
    if (!selected || stock === 0) return;
    addToCart(); // does nothing when everything available is already in the cart
    router.push("/checkout");
  };

  return (
    <div className="space-y-2">
      <button
        onClick={addToCart}
        disabled={!selected || stock === 0 || full}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-orange-500 py-3 font-bold text-white active:scale-95 disabled:bg-muted disabled:text-muted-foreground"
      >
        {added ? <Check size={18} /> : <ShoppingCart size={18} />}
        {full
          ? "All available are in your cart"
          : added
            ? "Added to cart"
            : "Add to Cart"}
      </button>
      <button
        onClick={orderViaWhatsApp}
        disabled={!selected || stock === 0}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 font-bold text-white active:scale-95 disabled:bg-muted disabled:text-muted-foreground"
      >
        <FaWhatsapp size={20} /> Order via WhatsApp
      </button>
    </div>
  );
}
