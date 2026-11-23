import { NavLink, useLocation } from "react-router-dom";
import { NAV, inGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";

type Props = { pending: number; onNavigate?: () => void };

export default function SidebarNav({ pending, onNavigate }: Props) {
  const { pathname } = useLocation(); // the page being shown
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3">
      {NAV.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to === "/orders" && pending > 0 ? "/orders?status=PENDING" : to}
          end={to === "/"}
          onClick={onNavigate}
          className={() =>
            cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors",
              inGroup(to, pathname)
                ? "bg-orange-500 text-white"
                : "text-white/80 hover:bg-white/10",
            )
          }
        >
          <Icon size={20} />
          <span className="flex-1">{label}</span>
          {to === "/orders" && pending > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              {pending}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
