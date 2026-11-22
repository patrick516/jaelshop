"use client"; // reads the order saved in the browser by the checkout page

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa"; // Official WhatsApp Icon
import type { Order, Settings } from "@/types";
import { whatsappLink } from "@/lib/whatsapp";
import EmptyState from "@/components/shared/EmptyState";
import OrderReceipt from "./OrderReceipt";

export default function OrderConfirmation({
  settings,
}: {
  settings: Settings;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("jael-last-order");
      if (saved) setOrder(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  if (!ready)
    return <div className="h-40 animate-pulse rounded-xl bg-secondary" />;
  if (!order)
    return (
      <EmptyState
        message="No recent order to show"
        href="/shop"
        label="Start Shopping"
      />
    );

  // The backend writes the order into the message. The plain chat link is only a fallback
  const chatLink =
    order.whatsappUrl ??
    whatsappLink(
      settings.whatsappNumber,
      `Hello, my order number is ${order.orderNumber}`,
    );

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-navy p-6 text-center text-white">
        <CheckCircle2 size={44} className="text-orange-500" />
        <h1 className="text-2xl font-extrabold">Order saved!</h1>
        <p className="text-sm text-white/80">Thank you, {order.shippingName}</p>
        <p className="rounded-full bg-white/10 px-4 py-1 text-sm font-bold">
          {order.orderNumber}
        </p>
      </div>

      <OrderReceipt order={order} />

      <div className="space-y-3 rounded-xl border-2 border-[#25D366] bg-white p-4 text-sm text-navy">
        <p className="font-extrabold">Last step: send your order on WhatsApp</p>
        <p className="text-muted-foreground">
          We confirm availability and arrange payment and delivery with you in
          the chat.
        </p>
        <a
          href={chatLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 font-bold text-white active:scale-95"
        >
          <FaWhatsapp size={20} /> Send order on WhatsApp
        </a>
      </div>

      <Link
        href="/shop"
        className="block text-center text-sm font-semibold text-orange-500"
      >
        Continue shopping
      </Link>
    </div>
  );
}
