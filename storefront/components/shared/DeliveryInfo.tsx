import { Truck, Wallet } from "lucide-react";
import type { Settings } from "@/types";
import { formatMK } from "@/lib/format";

// Delivery fee and accepted payments, shown on the product page
export default function DeliveryInfo({ settings }: { settings: Settings }) {
  return (
    <div className="space-y-3 rounded-xl border bg-white p-4 text-sm">
      <p className="flex items-start gap-2 text-navy">
        <Truck size={18} className="mt-0.5 shrink-0 text-orange-500" />
        <span>Delivery fee: {formatMK(settings.deliveryFee)}</span>
      </p>
      <p className="flex items-start gap-2 text-navy">
        <Wallet size={18} className="mt-0.5 shrink-0 text-orange-500" />
        <span>Pay with Airtel Money, TNM Mpamba or Cash on Delivery</span>
      </p>
    </div>
  );
}
