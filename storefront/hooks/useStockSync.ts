"use client"; // uses state and effects

import { useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useCart } from "@/store/cart";

// Asks the server how many are really left of everything in the cart, and fixes the cart to match.
// ready is false until the saved cart has been read
export function useStockSync(ready: boolean) {
  const { items, syncStock } = useCart();
  const key = items.map((i) => i.variantId).sort().join(","); // changes only when a different item is added or removed

  useEffect(() => {
    if (!ready || !key) return;
    let alive = true;
    api<Record<string, number>>(`/products/stock?ids=${key}`)
      .then((res) => {
        if (alive) syncStock(res.data).forEach((message) => toast.warning(message));
      })
      .catch(() => {}); // offline: the cart keeps what it already knows (the server checks again at checkout)
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, key]);
}
