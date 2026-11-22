import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { formatMK } from "@/lib/format";
type Props = { subtotal: number };

export default function CartTotals({ subtotal }: Props) {
  return (
    <div className="h-fit space-y-3 rounded-xl border bg-white p-4">
      <h2 className="font-extrabold text-navy">Order Summary</h2>
      <div className="flex justify-between text-sm text-navy">
        <span>Subtotal</span>
        <span>{formatMK(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm text-navy">
        <span>Delivery</span>
        <span className="text-muted-foreground">Agreed on WhatsApp</span>
      </div>
      <div className="flex justify-between border-t pt-3 text-lg font-extrabold text-navy">
        <span>Total</span>
        <span className="text-orange-500">{formatMK(subtotal)}</span>
      </div>
      <Link
        href="/checkout"
        className="flex min-h-11 w-full items-center justify-center rounded-full bg-orange-500 py-3 font-bold text-white active:scale-95"
      >
        Proceed to Checkout
      </Link>
      <Link
        href="/checkout"
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 font-bold text-white active:scale-95"
      >
        <FaWhatsapp size={20} /> Order via WhatsApp
      </Link>
    </div>
  );
}
