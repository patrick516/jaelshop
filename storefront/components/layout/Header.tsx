"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ShoppingBag, ShoppingCart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa"; // Added
import { useCart } from "@/store/cart";
import { whatsappLink } from "@/lib/whatsapp";

export default function Header({ whatsappNumber }: { whatsappNumber: string }) {
  const { count } = useCart();
  const router = useRouter();
  const [term, setTerm] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim())
      router.push(`/shop?search=${encodeURIComponent(term.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
            <ShoppingBag size={20} />
          </span>
          <span className="text-sm font-extrabold leading-tight text-navy">
            JAEL
            <br />
            ENTERPRISE
          </span>
        </Link>

        <form
          onSubmit={onSearch}
          className="relative mx-4 hidden flex-1 md:block"
        >
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border bg-secondary py-2 pl-4 pr-10 text-sm outline-none focus:border-orange-500"
          />
          <Search
            size={18}
            className="absolute right-3 top-2.5 text-muted-foreground"
          />
        </form>

        <div className="ml-auto flex items-center gap-4 text-navy">
          <Link href="/cart" className="relative" aria-label="Cart">
            <ShoppingCart size={24} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          {whatsappNumber && (
            <a
              href={whatsappLink(whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-green-500"
            >
              <FaWhatsapp size={28} /> {/* Changed */}
            </a>
          )}
        </div>
      </div>

      <form onSubmit={onSearch} className="relative px-4 pb-3 md:hidden">
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-full border bg-secondary py-2 pl-4 pr-10 text-sm outline-none focus:border-orange-500"
        />
        <Search
          size={18}
          className="absolute right-8 top-2.5 text-muted-foreground"
        />
      </form>
    </header>
  );
}
