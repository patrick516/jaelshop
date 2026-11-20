"use client"; // uses state

import { useState } from "react";
import { api } from "@/lib/api";
import type { CartItem } from "@/store/cart";

export type Applied = { code: string; discount: number; label: string };

// Checks a discount code against the cart. The server works out the discount from the real prices
export function useCoupon(items: CartItem[]) {
  const [input, setInput] = useState("");
  const [applied, setApplied] = useState<Applied | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const apply = async () => {
    if (!input.trim()) return;
    setError("");
    setBusy(true);
    try {
      const res = await api<Applied>("/coupons/check", {
        method: "POST",
        body: JSON.stringify({ code: input.trim(), items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })) }),
      });
      setApplied(res.data);
      setInput("");
    } catch (e) {
      setApplied(null);
      setError(e instanceof Error ? e.message : "Could not check the code");
    }
    setBusy(false);
  };

  const remove = () => {
    setApplied(null);
    setError("");
  };

  return { input, setInput, applied, error, busy, apply, remove };
}
