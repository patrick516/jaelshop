import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Field from "@/components/shared/Field";
import FormDialog from "@/components/shared/FormDialog";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";
import { versionLabel, type StockRow } from "./types";

type Props = { row: StockRow; onClose: () => void; onSaved: () => void };

// Add stock you received, or remove stock that was lost or damaged
export default function AdjustDialog({ row, onClose, onSaved }: Props) {
  const [adding, setAdding] = useState(true);
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const { busy, error, run } = useSubmit();

  const amount = Number(qty) || 0;
  const after = row.quantity + (adding ? amount : -amount);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const body = { quantity: adding ? amount : -amount, type: adding ? "PURCHASE" : "ADJUSTMENT", note: note.trim() || null };
    if (await run(() => api.post(`/inventory/variants/${row.variantId}/adjust`, body), "Stock updated")) onSaved();
  };

  return (
    <FormDialog title={`Adjust stock: ${row.productName} (${versionLabel(row)})`} busy={busy} error={error} onClose={onClose} onSubmit={submit}>
      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant={adding ? "default" : "outline"} onClick={() => setAdding(true)}>
          Add stock
        </Button>
        <Button type="button" variant={!adding ? "default" : "outline"} onClick={() => setAdding(false)}>
          Remove stock
        </Button>
      </div>
      <Field label="How many?" htmlFor="adj-qty" hint={`Now ${row.quantity}. After this: ${after < 0 ? "not allowed (below zero)" : after}.`}>
        <Input id="adj-qty" type="number" min={1} step={1} required value={qty} onChange={(e) => setQty(e.target.value)} />
      </Field>
      <Field label="Note (optional)" htmlFor="adj-note">
        <Input id="adj-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder={adding ? "e.g. New delivery from supplier" : "e.g. Damaged in storage"} />
      </Field>
    </FormDialog>
  );
}
