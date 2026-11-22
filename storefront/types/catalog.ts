export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  children?: Category[];
};

export type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
};

export type Variant = {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  priceOverride: string | null;
  isActive: boolean;
  inventory: { quantity: number } | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  compareAtPrice: string | null;
  isFeatured: boolean;
  images: ProductImage[];
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string; slug: string } | null;
  variants: Variant[];
  reviews?: { rating: number; comment: string | null; createdAt: string }[];
};

export type Settings = {
  storeName: string;
  whatsappNumber: string;
  airtelMoneyNumber: string;
  tnmMpambaNumber: string;
  pendingAlertHours: string;
};
