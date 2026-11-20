import { Truck, Wallet } from "lucide-react";

// How delivery and payment work. Both are agreed in the WhatsApp chat
export default function DeliveryInfo() {
  return (
    <div className="space-y-3 rounded-xl border bg-white p-4 text-sm">
      <p className="flex items-start gap-2 text-navy">
        <Truck size={18} className="mt-0.5 shrink-0 text-orange-500" />
        <span>
          Delivery cost and time depend on your location. We agree them with you
          on WhatsApp.
        </span>
      </p>
      <p className="flex items-start gap-2 text-navy">
        <Wallet size={18} className="mt-0.5 shrink-0 text-orange-500" />
        <span>
          Pay with Airtel Money, TNM Mpamba or cash on delivery. We arrange it
          with you in the chat.
        </span>
      </p>
    </div>
  );
}
