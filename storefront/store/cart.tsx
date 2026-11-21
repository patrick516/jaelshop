"use client"; // uses browser state and localStorage, so it cannot run on the server

import { createContext, useContext, useEffect, useState } from "react";
import { addQuantity, applyStock, changeQuantity, withStock, type CartItem } from "./cartLogic";

export type { CartItem } from "./cartLogic"; // other files import the type from here

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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false); // stops us saving the empty cart before we read the saved one

  // Once, when the page opens: read the saved cart. try/catch because localStorage can be blocked
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setItems(withStock(JSON.parse(saved) as CartItem[]));
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

  // The stock rules live in cartLogic.ts. Here the results are only saved into state
  const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
    const { added } = addQuantity(items, item, quantity);
    if (added > 0) setItems((prev) => addQuantity(prev, item, quantity).items);
    return added;
  };

  const syncStock: CartContextValue["syncStock"] = (stock) => {
    const { notices } = applyStock(items, stock);
    setItems((prev) => applyStock(prev, stock).items);
    return notices;
  };

  const setQuantity = (variantId: string, quantity: number) => setItems((prev) => changeQuantity(prev, variantId, quantity));
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
