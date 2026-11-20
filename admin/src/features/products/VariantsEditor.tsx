import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EMPTY_VARIANT, type VariantInput } from "./productForm";
import VariantRow from "./VariantRow";

type Props = { variants: VariantInput[]; onChange: (variants: VariantInput[]) => void };

// The list of versions. The first one can never be removed
export default function VariantsEditor({ variants, onChange }: Props) {
  const update = (index: number, key: keyof VariantInput, value: string) => onChange(variants.map((v, i) => (i === index ? { ...v, [key]: value } : v)));

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">No sizes or colours? Keep one line, leave Size and Colour empty and set the stock. Own price is only for a version that costs different from the selling price.</p>
      {variants.map((v, i) => (
        <VariantRow key={i} variant={v} onChange={(key, value) => update(i, key, value)} onRemove={variants.length > 1 ? () => onChange(variants.filter((_, n) => n !== i)) : undefined} />
      ))}
      <Button type="button" variant="outline" onClick={() => onChange([...variants, EMPTY_VARIANT])}>
        <Plus size={16} className="mr-2" /> Add another version
      </Button>
    </div>
  );
}
