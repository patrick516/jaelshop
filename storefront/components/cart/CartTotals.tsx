import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { formatMK } from "@/lib/format";

type Props = { subtotal: number; deliveryFee: number; whatsappHref: string };

// Totals with the Checkout and WhatsApp buttons
export default function CartTotals({ subtotal, deliveryFee, whatsappHref }: Props) {
  return (
    <div className="h-fit space-y-3 rounded-xl border bg-white p-4">
      <h2 className="font-extrabold text-navy">Order Summary</h2>
      <div className="flex justify-between text-sm text-navy">
        <span>Subtotal</span>
        <span>{formatMK(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm text-navy">
        <span>Delivery fee</span>
        <span>{formatMK(deliveryFee)}</span>
      </div>
      <div className="flex justify-between border-t pt-3 text-lg font-extrabold text-navy">
        <span>Total</span>
        <span className="text-orange-500">{formatMK(subtotal + deliveryFee)}</span>
      </div>
      <Link href="/checkout" className="flex min-h-11 w-full items-center justify-center rounded-full bg-orange-500 py-3 font-bold text-white active:scale-95">
        Proceed to Checkout
      </Link>
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 font-bold text-white active:scale-95">
        <MessageCircle size={18} /> Order via WhatsApp
      </a>
    </div>
  );
}
