import { Input } from "@/components/ui/input";
import Field from "@/components/shared/Field";
import type { FormValues, SetValue } from "./productForm";

// The three prices, in Kwacha
export default function PricingFields({ values, set }: { values: FormValues; set: SetValue }) {
  const price = { type: "number", min: 0, step: "any" } as const;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Field label="Selling price" htmlFor="price">
        <Input id="price" required {...price} value={values.price} onChange={(e) => set("price", e.target.value)} />
      </Field>
      <Field label="Old price (optional)" htmlFor="compare" hint="Shown crossed out, e.g. was MK 2,000.">
        <Input id="compare" {...price} value={values.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} />
      </Field>
      <Field label="Cost price (optional)" htmlFor="cost" hint="What you paid. Only staff can see it.">
        <Input id="cost" {...price} value={values.costPrice} onChange={(e) => set("costPrice", e.target.value)} />
      </Field>
    </div>
  );
}
