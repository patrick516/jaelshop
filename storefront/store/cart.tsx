"use client"; // uses browser state and localStorage, so it cannot run on the server

import { createContext, useContext, useEffect, useState } from "react";

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

// What every component gets when it calls useCart()
type CartContextValue = {
  items: CartItem[];
  count: number; // total number of items, shown in the header badge
  subtotal: number; // total price of all items
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => number; // returns how many were really added
  setQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  syncStock: (stock: Record<string, number>) => string[]; // applies fresh stock numbers, returns messages to show
  clear: () => void;
};

const KEY = "jael-cart"; // the name the cart is saved under in localStorage
const CartContext = createContext<CartContextValue | null>(null);
const nameOf = (i: CartItem) => `${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false); // stops us saving the empty cart before we read the saved one

  // Once, when the page opens: read the saved cart. try/catch because localStorage can be blocked
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      // carts saved before stock was tracked get a placeholder. The cart page replaces it with the real number
      if (saved) setItems((JSON.parse(saved) as CartItem[]).map((i) => ({ ...i, stock: typeof i.stock === "number" ? i.stock : 99 })));
    } catch {}
    setLoaded(true);
  }, []);

  // Every time the cart changes: save it
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  // Adding the same version twice raises its quantity. It never goes above the stock
  const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
    const have = items.find((i) => i.variantId === item.variantId)?.quantity ?? 0;
    const room = Math.max(0, Math.min(quantity, item.stock - have));
    if (room === 0) return 0;
    setItems((prev) => {
      if (!prev.some((i) => i.variantId === item.variantId)) return [...prev, { ...item, quantity: room }];
      return prev.map((i) => (i.variantId === item.variantId ? { ...i, stock: item.stock, quantity: Math.min(item.stock, i.quantity + room) } : i));
    });
    return room;
  };

  // A quantity of 0 or less removes the line. A quantity above the stock is lowered to the stock
  const setQuantity = (variantId: string, quantity: number) =>
    setItems((prev) => (quantity <= 0 ? prev.filter((i) => i.variantId !== variantId) : prev.map((i) => (i.variantId === variantId ? { ...i, quantity: Math.min(quantity, i.stock) } : i))));

  // Applies fresh stock numbers from the server: sold-out lines are removed, too-large quantities are lowered
  const syncStock: CartContextValue["syncStock"] = (stock) => {
    const notices = items.flatMap((i) => {
      const left = stock[i.variantId];
      if (left === undefined) return [];
      if (left <= 0) return [`${nameOf(i)} is sold out and was removed from your cart`];
      return i.quantity > left ? [`Only ${left} of ${nameOf(i)} left, so we lowered your quantity`] : [];
    });
    setItems((prev) =>
      prev.flatMap((i) => {
        const left = stock[i.variantId];
        if (left === undefined) return [i];
        return left <= 0 ? [] : [{ ...i, stock: left, quantity: Math.min(i.quantity, left) }];
      })
    );
    return notices;
  };

  const removeItem = (variantId: string) => setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  const clear = () => setItems([]);

  // Totals are worked out from the items, never stored separately
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return <CartContext.Provider value={{ items, count, subtotal, addItem, setQuantity, removeItem, syncStock, clear }}>{children}</CartContext.Provider>;
}

// Components call this to read or change the cart
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
