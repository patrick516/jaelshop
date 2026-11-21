// The logged-in customer, as returned by /auth/login and /auth/register
export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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
