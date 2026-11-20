import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import Field from "@/components/shared/Field";
import FormDialog from "@/components/shared/FormDialog";
import OptionSelect from "@/components/shared/OptionSelect";
import { useFetch } from "@/hooks/useFetch";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";

type Props = { onClose: () => void; onSaved: () => void };
const EMPTY = { productId: "", size: "", color: "", priceOverride: "", quantity: "0", lowStockThreshold: "5" };

// Add a new size or colour to a product you already have, with its opening stock
export default function AddVariantDialog({ onClose, onSaved }: Props) {
  const { data: products } = useFetch<{ id: string; name: string }[]>("/products/all?limit=100");
  const [v, setV] = useState(EMPTY);
  const [formError, setFormError] = useState("");
  const { busy, error, run } = useSubmit();
  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [key]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!v.productId) return setFormError("Please choose a product");
    setFormError("");
    const body = {
      size: v.size.trim() || undefined,
      color: v.color.trim() || undefined,
      priceOverride: v.priceOverride.trim() === "" ? null : Number(v.priceOverride),
      quantity: Number(v.quantity) || 0,
      lowStockThreshold: Number(v.lowStockThreshold) || 0,
    };
    if (await run(() => api.post(`/inventory/products/${v.productId}/variants`, body), "Version added")) onSaved();
  };

  return (
    <FormDialog title="Add a size or colour" busy={busy} error={formError || error} onClose={onClose} onSubmit={submit}>
      <Field label="Product">
        <OptionSelect value={v.productId} onChange={(productId) => setV({ ...v, productId })} options={(products ?? []).map((p) => ({ value: p.id, label: p.name }))} placeholder="Choose a product" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Size" htmlFor="v-size">
          <Input id="v-size" value={v.size} onChange={set("size")} placeholder="e.g. XL" />
        </Field>
        <Field label="Colour" htmlFor="v-color">
          <Input id="v-color" value={v.color} onChange={set("color")} placeholder="e.g. Red" />
        </Field>
        <Field label="Own price (optional)" htmlFor="v-price">
          <Input id="v-price" type="number" min={0} step="any" value={v.priceOverride} onChange={set("priceOverride")} />
        </Field>
        <Field label="Opening stock" htmlFor="v-qty">
          <Input id="v-qty" type="number" min={0} step={1} required value={v.quantity} onChange={set("quantity")} />
        </Field>
      </div>
      <Field label="Low stock warning at" htmlFor="v-low" hint="You are warned when stock falls to this number.">
        <Input id="v-low" type="number" min={0} step={1} value={v.lowStockThreshold} onChange={set("lowStockThreshold")} />
      </Field>
    </FormDialog>
  );
}
