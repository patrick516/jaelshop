"use client"; // uses state, the cart and the router

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Order } from "@/types";
import { useCart } from "@/store/cart";

export type CheckoutFields = { name: string; phone: string; district: string; area: string; address: string; notes: string };
// set("name") returns the onChange handler for the name field
export type SetField = (key: keyof CheckoutFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

const EMPTY: CheckoutFields = { name: "", phone: "", district: "", area: "", address: "", notes: "" };

// The form state and the "place order" request. The screen files only draw
export function useCheckout(couponCode?: string) {
  const { items, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<CheckoutFields>(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set: SetField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      // Saves the order for the admin panel. Only ids and quantities are sent, the backend works out the prices
      const res = await api<Order>("/orders/whatsapp", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
          shippingName: form.name,
          shippingPhone: form.phone,
          shippingDistrict: form.district,
          shippingArea: form.area,
          shippingAddress: form.address || undefined,
          notes: form.notes || undefined,
          couponCode, // left out of the request when there is none
        }),
      });
      sessionStorage.setItem("jael-last-order", JSON.stringify(res.data)); // the confirmation page reads it
      clear();
      router.push("/order-confirmation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  };

  return { form, set, error, busy, submit };
}
