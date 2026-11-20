import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserMenu from "./UserMenu";

type Props = { pending: number; onMenu: () => void };

// The white bar at the top: menu button (phones), search, bell and the profile menu
export default function Topbar({ pending, onMenu }: Props) {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

  // Search sends staff to the products page with the term in the address
  const search = (e: FormEvent) => {
    e.preventDefault();
    if (term.trim()) navigate(`/products?search=${encodeURIComponent(term.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-white px-4">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Open menu">
        <Menu size={22} />
      </Button>
      <form onSubmit={search} className="relative hidden max-w-xl flex-1 sm:block">
        <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search products..." className="rounded-full bg-secondary pr-10" />
        <Search size={18} className="absolute right-3 top-2.5 text-muted-foreground" />
      </form>
      <div className="ml-auto flex items-center gap-4">
        <Link to="/orders" aria-label={`${pending} pending orders`} className="relative text-navy">
          <Bell size={24} />
          {pending > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">{pending}</span>
          )}
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
