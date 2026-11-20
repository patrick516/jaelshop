import { MessageCircle } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";

// Opens WhatsApp to the buyer with a message about their order. The backend builds the link
export default function CustomerWhatsApp({ orderId }: { orderId: string }) {
  const { data } = useFetch<{ url: string }>(`/orders/${orderId}/whatsapp`);
  if (!data?.url) return null;

  return (
    <a href={data.url} target="_blank" rel="noopener noreferrer" className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 font-bold text-white">
      <MessageCircle size={18} /> Message customer on WhatsApp
    </a>
  );
}
