import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Field from "@/components/shared/Field";
import FormDialog from "@/components/shared/FormDialog";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";
import type { Brand } from "./types";

type Props = { brand: Brand | null; onClose: () => void; onSaved: () => void };

// Add a brand (brand is null) or edit one
export default function BrandDialog({ brand, onClose, onSaved }: Props) {
  const [name, setName] = useState(brand?.name ?? "");
  const [isActive, setIsActive] = useState(brand?.isActive ?? true);
  const { busy, error, run } = useSubmit();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const body = { name: name.trim(), isActive };
    const request = () => (brand ? api.put(`/brands/${brand.id}`, body) : api.post("/brands", body));
    if (await run(request, brand ? "Brand updated" : "Brand created")) onSaved();
  };

  return (
    <FormDialog title={brand ? "Edit brand" : "Add brand"} busy={busy} error={error} onClose={onClose} onSubmit={submit}>
      <Field label="Name" htmlFor="brand-name">
        <Input id="brand-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. HP" />
      </Field>
      <div className="flex items-center gap-3">
        <Switch id="brand-active" checked={isActive} onCheckedChange={setIsActive} />
        <label htmlFor="brand-active" className="text-sm font-medium">
          Show in the shop
        </label>
      </div>
    </FormDialog>
  );
}
