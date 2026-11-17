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
};

// What every component gets when it calls useCart()
type CartContextValue = {
  items: CartItem[];
  count: number; // total number of items, shown in the header badge
  subtotal: number; // total price of all items
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void; // Omit = the item without its quantity
  setQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
};

const KEY = "jael-cart"; // the name the cart is saved under in localStorage
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false); // stops us saving the empty cart before we read the saved one

  // Once, when the page opens: read the saved cart. try/catch because localStorage can be blocked
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setItems(JSON.parse(saved));
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

  // Adding the same variant twice increases its quantity instead of making a second line
  const addItem: CartContextValue["addItem"] = (item, quantity = 1) =>
    setItems((prev) => {
      const found = prev.find((i) => i.variantId === item.variantId);
      if (found) return prev.map((i) => (i.variantId === item.variantId ? { ...i, quantity: i.quantity + quantity } : i));
      return [...prev, { ...item, quantity }];
    });

  // A quantity of 0 or less removes the line
  const setQuantity = (variantId: string, quantity: number) =>
    setItems((prev) =>
      quantity <= 0 ? prev.filter((i) => i.variantId !== variantId) : prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );

  const removeItem = (variantId: string) => setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  const clear = () => setItems([]);

  // Totals are worked out from the items, never stored separately
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return <CartContext.Provider value={{ items, count, subtotal, addItem, setQuantity, removeItem, clear }}>{children}</CartContext.Provider>;
}

// Components call this to read or change the cart
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
