import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { api } from "@/lib/api";
import type { Settings } from "@/types";

// The round chat button in the bottom right corner. It opens WhatsApp with the number from Settings
export default function FloatingChat() {
  const [number, setNumber] = useState("");

  useEffect(() => {
    api
      .get<Settings>("/settings")
      .then((res) => setNumber(res.data.whatsappNumber))
      .catch(() => {}); // no number means no button
  }, []);

  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
    >
      <MessageCircle size={28} />
    </a>
  );
}
