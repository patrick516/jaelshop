import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Field from "@/components/shared/Field";
import FormDialog from "@/components/shared/FormDialog";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";
import type { StockRow } from "./types";

type Props = { row: StockRow; onClose: () => void; onSaved: () => void };

// Rename a version or hide it from the shop. Stock is changed with Adjust, not here
export default function EditVariantDialog({ row, onClose, onSaved }: Props) {
  const [size, setSize] = useState(row.size ?? "");
  const [color, setColor] = useState(row.color ?? "");
  const [isActive, setIsActive] = useState(row.isActive);
  const { busy, error, run } = useSubmit();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const body = { size: size.trim() || null, color: color.trim() || null, isActive };
    if (await run(() => api.put(`/inventory/variants/${row.variantId}`, body), "Version updated")) onSaved();
  };

  return (
    <FormDialog title={`Edit version: ${row.productName}`} busy={busy} error={error} onClose={onClose} onSubmit={submit}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Size" htmlFor="e-size">
          <Input id="e-size" value={size} onChange={(e) => setSize(e.target.value)} />
        </Field>
        <Field label="Colour" htmlFor="e-color">
          <Input id="e-color" value={color} onChange={(e) => setColor(e.target.value)} />
        </Field>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="e-active" checked={isActive} onCheckedChange={setIsActive} />
        <label htmlFor="e-active" className="text-sm font-medium">
          Sold in the shop
        </label>
      </div>
    </FormDialog>
  );
}
