"use client"; // typing and buttons

import { Tag, X } from "lucide-react";
import type { useCoupon } from "@/hooks/useCoupon";
import { field } from "@/lib/styles";

// The discount code box. Shows the applied code with a remove button once it works
export default function CouponBox({ input, setInput, applied, error, busy, apply, remove }: ReturnType<typeof useCoupon>) {
  if (applied) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-xl bg-green-50 p-3 text-sm">
        <span className="flex items-center gap-2 font-semibold text-green-700">
          <Tag size={16} /> {applied.code} applied ({applied.label})
        </span>
        <button type="button" onClick={remove} aria-label="Remove code" className="flex h-8 w-8 items-center justify-center text-green-700">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Enter must not place the whole order
              apply();
            }
          }}
          placeholder="Discount code"
          className={`${field} uppercase`}
        />
        <button type="button" onClick={apply} disabled={busy || !input.trim()} className="shrink-0 rounded-lg bg-navy px-4 text-sm font-semibold text-white disabled:opacity-60">
          {busy ? "Checking..." : "Apply"}
        </button>
      </div>
      {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
    </div>
  );
}
