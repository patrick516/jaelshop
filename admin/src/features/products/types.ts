import type { Opt } from "@/components/shared/OptionSelect";

export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type Variant = {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  priceOverride: string | null; // money arrives as text, e.g. "1500"
  isActive: boolean;
  inventory: { quantity: number; lowStockThreshold: number } | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  compareAtPrice: string | null;
  costPrice: string | null; // only staff receive this
  status: ProductStatus;
  isFeatured: boolean;
  images: { id: string; url: string; altText: string | null; isPrimary: boolean }[];
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string; slug: string } | null;
  variants: Variant[];
};

export const STATUS_OPTIONS: Opt[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
];

// Total units in stock across every active version
export const totalStock = (p: Product): number => p.variants.filter((v) => v.isActive).reduce((sum, v) => sum + (v.inventory?.quantity ?? 0), 0);
