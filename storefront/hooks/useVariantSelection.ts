"use client"; // uses state

import { useState } from "react";
import type { Product, Variant } from "@/types";

// Stock of one version. A missing inventory row counts as 0
export const stockOf = (v: Variant) => v.inventory?.quantity ?? 0;

// Everything about which size, colour and quantity the visitor has chosen
export function useVariantSelection(product: Product) {
  const variants = product.variants.filter((v) => v.isActive);
  const sizes = [...new Set(variants.map((v) => v.size).filter((s): s is string => !!s))];
  const colors = [...new Set(variants.map((v) => v.color).filter((c): c is string => !!c))];

  // Start on the first version that is in stock
  const first = variants.find((v) => stockOf(v) > 0) ?? variants[0];
  const [size, setSize] = useState<string | null>(first?.size ?? null);
  const [color, setColor] = useState<string | null>(first?.color ?? null);
  const [qty, setQty] = useState(1);

  // Picking a size keeps the colour if that pair exists, otherwise moves to one that does
  const pickSize = (s: string) => {
    const match = variants.find((v) => v.size === s && v.color === color) ?? variants.find((v) => v.size === s && stockOf(v) > 0) ?? variants.find((v) => v.size === s);
    setSize(s);
    setColor(match?.color ?? null);
    setQty(1);
  };
  const pickColor = (c: string) => {
    const match = variants.find((v) => v.color === c && v.size === size) ?? variants.find((v) => v.color === c && stockOf(v) > 0) ?? variants.find((v) => v.color === c);
    setColor(c);
    setSize(match?.size ?? null);
    setQty(1);
  };

  // The exact version chosen, and what it costs
  const selected = variants.find((v) => v.size === size && v.color === color);
  const stock = selected ? stockOf(selected) : 0;
  const price = Number(selected?.priceOverride ?? product.price); // the version's own price wins
  const label = [selected?.size, selected?.color].filter(Boolean).join(" / ");

  // Used to fade sold-out chips
  const sizeInStock = (s: string) => variants.some((v) => v.size === s && stockOf(v) > 0);
  const colorInStock = (c: string) => variants.some((v) => v.color === c && stockOf(v) > 0);

  return { sizes, colors, size, color, qty, setQty, pickSize, pickColor, selected, stock, price, label, sizeInStock, colorInStock };
}

export type VariantSelection = ReturnType<typeof useVariantSelection>;
