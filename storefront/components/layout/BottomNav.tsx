"use client"; // needs the current page address and the cart

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, User } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa"; // Official WhatsApp Icon
import { useCart } from "@/store/cart";
import { whatsappLink } from "@/lib/whatsapp";

// The four page tabs of the mobile design. WhatsApp is added after them
const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Categories", icon: LayoutGrid },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/account", label: "Account", icon: User },
];

export default function BottomNav({
  whatsappNumber,
}: {
  whatsappNumber: string;
}) {
  const pathname = usePathname(); // the page we are on, e.g. "/cart"
  const { count } = useCart();

  return (
    // md:hidden = shown on phones and tablets only, desktop uses the header
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-white md:hidden">
      <ul className="mx-auto flex max-w-md items-center justify-around py-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          // "/" must match exactly, other tabs also match their sub-pages (/shop/...)
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`relative flex flex-col items-center gap-0.5 text-[11px] font-medium ${active ? "text-orange-500" : "text-navy"}`}
              >
                <Icon size={22} />
                {label}
                {label === "Cart" && count > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
        {whatsappNumber && (
          <li>
            <a
              href={whatsappLink(whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-green-600"
            >
              <FaWhatsapp size={24} />{" "}
              {/* Changed from <MessageCircle size={22} /> */}
              WhatsApp
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}
