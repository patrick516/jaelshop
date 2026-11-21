// One line in the cart. Everything the cart page needs is saved here, so it never has to ask the API
export type CartItem = {
  variantId: string; // the exact size/colour the backend needs when ordering
  productId: string;
  slug: string; // for the link back to the product page
  name: string;
  variantLabel: string | null; // e.g. "A4 / Blue"
  image: string | null;
  price: number; // price of ONE item in MWK
  quantity: number;
  stock: number; // how many are available. The quantity can never go above this
};

const nameOf = (i: CartItem) => `${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""}`;

// Carts saved before stock was tracked get a placeholder. The cart page replaces it with the real number
export const withStock = (saved: CartItem[]): CartItem[] => saved.map((i) => ({ ...i, stock: typeof i.stock === "number" ? i.stock : 99 }));

// Adds an item. The quantity never goes above the stock. added is how many were really added
export function addQuantity(items: CartItem[], item: Omit<CartItem, "quantity">, quantity: number) {
  const have = items.find((i) => i.variantId === item.variantId)?.quantity ?? 0;
  const added = Math.max(0, Math.min(quantity, item.stock - have));
  if (added === 0) return { items, added };
  if (!items.some((i) => i.variantId === item.variantId)) return { items: [...items, { ...item, quantity: added }], added };
  return { items: items.map((i) => (i.variantId === item.variantId ? { ...i, stock: item.stock, quantity: Math.min(item.stock, i.quantity + added) } : i)), added };
}

// A quantity of 0 or less removes the line. A quantity above the stock is lowered to the stock
export const changeQuantity = (items: CartItem[], variantId: string, quantity: number): CartItem[] =>
  quantity <= 0 ? items.filter((i) => i.variantId !== variantId) : items.map((i) => (i.variantId === variantId ? { ...i, quantity: Math.min(quantity, i.stock) } : i));

// Applies fresh stock numbers from the server: sold-out lines are removed and too-large quantities are lowered.
// notices are the messages to show the shopper
export function applyStock(items: CartItem[], stock: Record<string, number>) {
  const notices: string[] = [];
  const next = items.flatMap((i) => {
    const left = stock[i.variantId];
    if (left === undefined) return [i];
    if (left <= 0) {
      notices.push(`${nameOf(i)} is sold out and was removed from your cart`);
      return [];
    }
    if (i.quantity > left) notices.push(`Only ${left} of ${nameOf(i)} left, so we lowered your quantity`);
    return [{ ...i, stock: left, quantity: Math.min(i.quantity, left) }];
  });
  return { items: next, notices };
}
