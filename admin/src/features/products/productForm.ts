import type { Product, ProductStatus } from "./types";

// Every field is text while the staff member types. buildPayload turns them into numbers for the backend
export type VariantInput = { size: string; color: string; priceOverride: string; quantity: string };
export type FormValues = {
  name: string;
  description: string;
  price: string;
  compareAtPrice: string;
  costPrice: string;
  categoryId: string;
  brandId: string;
  status: ProductStatus;
  isFeatured: boolean;
  imageUrls: string[]; // uploaded pictures, the first one is the main picture
  variants: VariantInput[];
};
export type SetValue = <K extends keyof FormValues>(key: K, value: FormValues[K]) => void;

export const EMPTY_VARIANT: VariantInput = { size: "", color: "", priceOverride: "", quantity: "0" };
export const EMPTY_FORM: FormValues = {
  name: "", description: "", price: "", compareAtPrice: "", costPrice: "", categoryId: "", brandId: "",
  status: "ACTIVE", isFeatured: false, imageUrls: [], variants: [EMPTY_VARIANT],
};

const money = (v: string | null) => (v === null ? "" : String(Number(v))); // "1500.00" becomes "1500"
const num = (v: string) => (v.trim() === "" ? null : Number(v));

// A saved product, as form text (used when editing)
export const toValues = (p: Product): FormValues => ({
  ...EMPTY_FORM,
  name: p.name,
  description: p.description ?? "",
  price: money(p.price),
  compareAtPrice: money(p.compareAtPrice),
  costPrice: money(p.costPrice),
  categoryId: p.category.id,
  brandId: p.brand?.id ?? "",
  status: p.status,
  isFeatured: p.isFeatured,
});

// The request body. Editing sends the main fields only, the backend keeps images and versions as they are
export function buildPayload(v: FormValues, isEdit: boolean) {
  const main = {
    name: v.name.trim(),
    description: v.description.trim() || null,
    price: Number(v.price),
    compareAtPrice: num(v.compareAtPrice),
    costPrice: num(v.costPrice),
    categoryId: v.categoryId,
    brandId: v.brandId || null,
    status: v.status,
    isFeatured: v.isFeatured,
  };
  if (isEdit) return main;

  return {
    ...main,
    images: v.imageUrls.map((url, i) => ({ url, isPrimary: i === 0 })),
    variants: v.variants.map((x) => ({
      size: x.size.trim() || undefined,
      color: x.color.trim() || undefined,
      priceOverride: num(x.priceOverride),
      quantity: Number(x.quantity) || 0,
    })),
  };
}
