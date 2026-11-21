"use client"; // reads the cart saved in the browser

import { useEffect, useState } from "react";
import type { Settings } from "@/types";
import { useCart } from "@/store/cart";
import { useStockSync } from "@/hooks/useStockSync";
import { whatsappLink } from "@/lib/whatsapp";
import { buildCartMessage } from "@/lib/cartMessage";
import EmptyState from "@/components/shared/EmptyState";
import CartItemRow from "./CartItemRow";
import CartTotals from "./CartTotals";

// Only puts the cart pieces together
export default function CartView({ settings }: { settings: Settings }) {
  const { items, subtotal, setQuantity, removeItem } = useCart();

  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  useStockSync(ready);

  if (!ready)
    return <div className="h-40 animate-pulse rounded-xl bg-secondary" />;
  if (items.length === 0)
    return (
      <EmptyState
        message="Your cart is empty"
        href="/shop"
        label="Start Shopping"
      />
    );

  const message = buildCartMessage(items, settings.storeName, subtotal);

  return (
    <div className="space-y-5 md:grid md:grid-cols-[1fr_340px] md:gap-8 md:space-y-0">
      <div>
        <h1 className="mb-3 text-2xl font-extrabold text-navy">My Cart</h1>
        <div className="space-y-3">
          {items.map((i) => (
            <CartItemRow
              key={i.variantId}
              item={i}
              onQuantity={(n) => setQuantity(i.variantId, n)}
              onRemove={() => removeItem(i.variantId)}
            />
          ))}
        </div>
      </div>
      <CartTotals
        subtotal={subtotal}
        whatsappHref={whatsappLink(settings.whatsappNumber, message)}
      />
    </div>
  );
}
