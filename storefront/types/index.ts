export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
};

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
};

// The logged-in customer, as returned by /auth/login and /auth/register
export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type OrderItem = {
  id: string;
  productName: string;
  variantLabel: string | null;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
};

// What the backend returns after placing an order
export type Order = {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: string;
  deliveryFee: string;
  discountTotal: string;
  total: string;
  shippingName: string;
  shippingPhone: string;
  shippingDistrict: string;
  shippingArea: string;
  shippingAddress: string | null;
  createdAt: string;
  items: OrderItem[];
  payments: { method: string; status: string }[];
  whatsappUrl?: string | null; // click-to-chat link built by the backend
};

// The customer profile from GET /customers/me
export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: string;
};

// A saved delivery address
export type Address = {
  id: string;
  label: string | null;
  fullName: string;
  phone: string;
  district: string;
  area: string;
  addressLine: string | null;
  isDefault: boolean;
};

// One wishlist entry, with a small copy of the product
export type WishlistEntry = {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    status: string;
    images: { url: string; altText: string | null }[];
  };
};
