"use client"; // the cart and the form live in the browser

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import type { Settings } from "@/types";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/hooks/useCheckout";
import { useCoupon } from "@/hooks/useCoupon";
import EmptyState from "@/components/shared/EmptyState";
import CouponBox from "./CouponBox";
import DeliveryFields from "./DeliveryFields";
import OrderSummary from "./OrderSummary";

// Only puts the checkout pieces together. The logic is in hooks/useCheckout.ts and hooks/useCoupon.ts
export default function CheckoutForm({ settings }: { settings: Settings }) {
  const { items, subtotal } = useCart();
  const coupon = useCoupon(items);
  const { form, set, error, busy, submit } = useCheckout(coupon.applied?.code);

  // Wait until the browser has read the saved cart, so we never flash "cart is empty"
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) return <div className="h-40 animate-pulse rounded-xl bg-secondary" />;
  if (items.length === 0) return <EmptyState message="Your cart is empty" href="/shop" label="Start Shopping" />;

  return (
    <form onSubmit={submit} className="space-y-5 md:grid md:grid-cols-[1fr_340px] md:gap-8 md:space-y-0">
      <div className="space-y-5">
        <h1 className="text-2xl font-extrabold text-navy">Checkout</h1>
        <p className="rounded-xl bg-orange-50 p-3 text-sm text-navy">
          No account needed. Enter your delivery details, then send your order to us on WhatsApp. We will confirm it and arrange payment with you there.
        </p>
        <DeliveryFields form={form} set={set} />
        <section className="space-y-3">
          <h2 className="font-extrabold text-navy">Discount code</h2>
          <CouponBox {...coupon} />
        </section>
      </div>

      <OrderSummary items={items} subtotal={subtotal} deliveryFee={Number(settings.deliveryFee)} discount={coupon.applied?.discount ?? 0}>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p>}
        <button disabled={busy} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 font-bold text-white active:scale-95 disabled:opacity-60">
          <MessageCircle size={18} /> {busy ? "Saving order..." : "Continue to WhatsApp"}
        </button>
      </OrderSummary>
    </form>
  );
}
