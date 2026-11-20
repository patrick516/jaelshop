import { Input } from "@/components/ui/input";
import Field from "@/components/shared/Field";
import type { FormValues, SetValue } from "./productForm";
import ProfitHint from "./ProfitHint";

// The three prices, in Kwacha, with the profit per item worked out underneath
export default function PricingFields({ values, set }: { values: FormValues; set: SetValue }) {
  const price = { type: "number", min: 0, step: "any" } as const;

  return (
    <div className="space-y-3">
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Selling price" htmlFor="price">
          <Input id="price" required {...price} value={values.price} onChange={(e) => set("price", e.target.value)} />
        </Field>
        <Field label="Old price (optional)" htmlFor="compare" hint="Shown crossed out, e.g. was MK 2,000.">
          <Input id="compare" {...price} value={values.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} />
        </Field>
        <Field label="Cost price (optional)" htmlFor="cost" hint="What you paid. Needed to work out profit. Only staff can see it.">
          <Input id="cost" {...price} value={values.costPrice} onChange={(e) => set("costPrice", e.target.value)} />
        </Field>
      </div>
      <ProfitHint price={values.price} cost={values.costPrice} />
    </div>
  );
}
