import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Field from "@/components/shared/Field";
import FormDialog from "@/components/shared/FormDialog";
import OptionSelect from "@/components/shared/OptionSelect";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";
import { toPayload, toValues, type CategoryValues } from "./categoryForm";
import type { Category } from "./types";

type Props = { category: Category | null; all: Category[]; onClose: () => void; onSaved: () => void };

// Add a category (category is null) or edit one
export default function CategoryDialog({ category, all, onClose, onSaved }: Props) {
  const [v, setV] = useState<CategoryValues>(() => toValues(category));
  const { busy, error, run } = useSubmit();
  const set = <K extends keyof CategoryValues>(key: K, value: CategoryValues[K]) => setV((x) => ({ ...x, [key]: value }));

  // A sub-category can only sit under a main category, and a category that has sub-categories stays a main one
  const hasChildren = !!category && all.some((c) => c.parentId === category.id);
  const parents = hasChildren ? [] : all.filter((c) => !c.parentId && c.id !== category?.id).map((c) => ({ value: c.id, label: c.name }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const request = () => (category ? api.put(`/categories/${category.id}`, toPayload(v)) : api.post("/categories", toPayload(v)));
    if (await run(request, category ? "Category updated" : "Category created")) onSaved();
  };

  return (
    <FormDialog title={category ? "Edit category" : "Add category"} busy={busy} error={error} onClose={onClose} onSubmit={submit}>
      <Field label="Name" htmlFor="cat-name">
        <Input id="cat-name" required value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Stationery" />
      </Field>
      <Field label="Main category (optional)" hint="Leave empty for a main category, or pick one to make this a sub-category.">
        <OptionSelect value={v.parentId} onChange={(x) => set("parentId", x)} options={parents} placeholder="None" noneLabel="None (main category)" />
      </Field>
      <Field label="Description (optional)" htmlFor="cat-desc">
        <Textarea id="cat-desc" rows={3} value={v.description} onChange={(e) => set("description", e.target.value)} />
      </Field>
      <Field label="Sort order" htmlFor="cat-sort" hint="Smaller numbers show first.">
        <Input id="cat-sort" type="number" min={0} step={1} value={v.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} />
      </Field>
      <div className="flex items-center gap-3">
        <Switch id="cat-active" checked={v.isActive} onCheckedChange={(on) => set("isActive", on)} />
        <label htmlFor="cat-active" className="text-sm font-medium">
          Show in the shop
        </label>
      </div>
    </FormDialog>
  );
}
