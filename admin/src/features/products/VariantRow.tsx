import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Field from "@/components/shared/Field";
import type { VariantInput } from "./productForm";

type Props = { variant: VariantInput; onChange: (key: keyof VariantInput, value: string) => void; onRemove?: () => void };

// One version of a product: size, colour, its own price and its starting stock
export default function VariantRow({ variant, onChange, onRemove }: Props) {
  return (
    <div className="grid grid-cols-2 items-end gap-3 rounded-lg border p-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
      <Field label="Size">
        <Input value={variant.size} onChange={(e) => onChange("size", e.target.value)} placeholder="e.g. A4" />
      </Field>
      <Field label="Colour">
        <Input value={variant.color} onChange={(e) => onChange("color", e.target.value)} placeholder="e.g. Blue" />
      </Field>
      <Field label="Own price">
        <Input type="number" min={0} step="any" value={variant.priceOverride} onChange={(e) => onChange("priceOverride", e.target.value)} placeholder="Optional" />
      </Field>
      <Field label="Stock">
        <Input type="number" min={0} step={1} required value={variant.quantity} onChange={(e) => onChange("quantity", e.target.value)} />
      </Field>
      {onRemove && (
        <Button type="button" variant="ghost" size="icon" onClick={onRemove} aria-label="Remove this version" className="text-destructive">
          <Trash2 size={16} />
        </Button>
      )}
    </div>
  );
}
