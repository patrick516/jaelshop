import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import { groupOf } from "@/lib/nav";
import { cn } from "@/lib/utils";

// The row of tabs above a page that belongs to a group, e.g. Products | Stock | Categories | Brands
export default function SectionTabs() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const group = groupOf(pathname);
  if (!group?.tabs) return null; // Dashboard, Customers and Reports have no tabs

  // Staff and Activity are for Administrators only, the backend refuses everyone else
  const tabs = group.tabs.filter((t) => !t.adminOnly || user?.role === "Administrator");
  if (tabs.length < 2) return null; // one tab on its own is pointless

  return (
    <div className="mb-4 flex gap-1 overflow-x-auto border-b">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) =>
            cn(
              "-mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
              isActive ? "border-orange-500 text-orange-600" : "border-transparent text-muted-foreground hover:text-navy",
            )
          }
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  );
}
