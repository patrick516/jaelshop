import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { formatMK } from "@/lib/format";
import { whatsappLink } from "@/lib/phone";
import type { Settings } from "@/types";

type Props = { name: string; phone: string | null; balance: number };

// Opens WhatsApp to the customer with a polite message about what they owe
export default function ReminderButton({ name, phone, balance }: Props) {
  const { data: settings } = useFetch<Settings>("/settings");
  if (!phone || balance <= 0) return null;

  const ways = [settings?.airtelMoneyNumber && `Airtel Money ${settings.airtelMoneyNumber}`, settings?.tnmMpambaNumber && `TNM Mpamba ${settings.tnmMpambaNumber}`].filter(Boolean);
  const text = [
    `Hello ${name}, a friendly reminder from ${settings?.storeName ?? "JAEL Enterprise"}: your balance is ${formatMK(balance)}.`,
    ways.length > 0 && `You can pay by ${ways.join(" or ")}, or in cash.`,
    "Thank you!",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Button asChild variant="outline" className="border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366]">
      <a href={whatsappLink(phone, text)} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={16} className="mr-2" /> Send reminder
      </a>
    </Button>
  );
}
