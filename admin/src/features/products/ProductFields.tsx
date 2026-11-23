import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Field from "@/components/shared/Field";
import CreatableSelect from "@/components/shared/CreatableSelect";
import OptionSelect from "@/components/shared/OptionSelect";
import type { FormValues, SetValue } from "./productForm";
import { STATUS_OPTIONS, type ProductStatus } from "./types";
import type { Option } from "./useLookups";

type Props = {
  values: FormValues;
  set: SetValue;
  categories: Option[];
  brands: Option[];
  onCreateCategory: (name: string) => Promise<Option>; // saves a new category and returns it
  onCreateBrand: (name: string) => Promise<Option>;
};

export default function ProductFields({
  values,
  set,
  categories,
  brands,
  onCreateCategory,
  onCreateBrand,
}: Props) {
  return (
    <>
      <Field label="Product name" htmlFor="name">
        <Input
          id="name"
          required
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. A4 Notebook"
        />
      </Field>
      <Field label="Description (optional)" htmlFor="description">
        <Textarea
          id="description"
          rows={4}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Category" hint="Pick one, or type a new name to add it.">
          <CreatableSelect
            value={values.categoryId}
            onChange={(v) => set("categoryId", v)}
            options={categories}
            placeholder="Choose a category"
            kind="category"
            onCreate={onCreateCategory}
          />
        </Field>
        <Field
          label="Brand (optional)"
          hint="Pick one, or type a new name to add it."
        >
          <CreatableSelect
            value={values.brandId}
            onChange={(v) => set("brandId", v)}
            options={brands}
            placeholder="No brand"
            noneLabel="No brand"
            kind="brand"
            onCreate={onCreateBrand}
          />
        </Field>
        <Field label="Status" hint="Only Active products show in the shop.">
          <OptionSelect
            value={values.status}
            onChange={(v) => set("status", v as ProductStatus)}
            options={STATUS_OPTIONS}
            placeholder="Status"
          />
        </Field>
        <div className="flex items-center gap-3 md:pt-7">
          <Switch
            id="featured"
            checked={values.isFeatured}
            onCheckedChange={(on) => set("isFeatured", on)}
          />
          <label htmlFor="featured" className="text-sm font-medium">
            Show in Featured Products
          </label>
        </div>
      </div>
    </>
  );
}
