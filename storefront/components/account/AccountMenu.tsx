"use client"; // the logout button needs the login

import Link from "next/link";
import { ChevronRight, Heart, LogOut, MapPin, Package } from "lucide-react";
import { useAuth } from "@/store/auth";

const LINKS = [
  { href: "/orders", label: "My Orders", Icon: Package },
  { href: "/wishlist", label: "Wishlist", Icon: Heart },
  { href: "/addresses", label: "Saved Addresses", Icon: MapPin },
];

// The list of account pages and the Log out button
export default function AccountMenu() {
  const { logout } = useAuth();
  const row = "flex min-h-12 w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-navy";

  return (
    <div className="divide-y overflow-hidden rounded-xl border bg-white">
      {LINKS.map(({ href, label, Icon }) => (
        <Link key={href} href={href} className={row}>
          <Icon size={20} className="text-orange-500" />
          <span className="flex-1">{label}</span>
          <ChevronRight size={18} className="text-muted-foreground" />
        </Link>
      ))}
      {/* After logout the page sends the visitor to /login by itself */}
      <button onClick={logout} className={`${row} text-destructive`}>
        <LogOut size={20} />
        <span>Log out</span>
      </button>
    </div>
  );
}
