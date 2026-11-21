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
