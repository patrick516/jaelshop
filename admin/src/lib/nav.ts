import { BarChart3, Home, Package, Settings, ShoppingCart, Users, type LucideIcon } from "lucide-react";

export type Tab = { to: string; label: string; adminOnly?: boolean }; // adminOnly tabs are hidden from other staff
export type NavItem = { to: string; label: string; Icon: LucideIcon; tabs?: Tab[] };

// The sidebar. Each item with tabs owns several pages, which show as tabs above the page
export const NAV: NavItem[] = [
  { to: "/", label: "Dashboard", Icon: Home },
  {
    to: "/products",
    label: "Products",
    Icon: Package,
    tabs: [
      { to: "/products", label: "Products" },
      { to: "/inventory", label: "Stock" },
      { to: "/categories", label: "Categories" },
      { to: "/brands", label: "Brands" },
    ],
  },
  {
    to: "/orders",
    label: "Orders",
    Icon: ShoppingCart,
    tabs: [
      { to: "/orders", label: "Orders" },
      { to: "/payments", label: "Payments" },
    ],
  },
  { to: "/customers", label: "Customers", Icon: Users },
  { to: "/reports", label: "Reports", Icon: BarChart3 },
  {
    to: "/settings",
    label: "Settings",
    Icon: Settings,
    tabs: [
      { to: "/settings", label: "Shop" },
      { to: "/marketing", label: "Discount codes" },
      { to: "/staff", label: "Staff", adminOnly: true },
      { to: "/activity-logs", label: "Activity", adminOnly: true },
    ],
  },
];

// The sidebar item that owns an address, e.g. "/payments" belongs to Orders
export const groupOf = (pathname: string): NavItem | undefined =>
  NAV.find((item) =>
    item.to === "/"
      ? pathname === "/" // "/" would otherwise match every page
      : [item.to, ...(item.tabs?.map((t) => t.to) ?? [])].some((p) => pathname === p || pathname.startsWith(`${p}/`)),
  );

// True when the page being shown belongs to this sidebar item (it turns orange)
export const inGroup = (to: string, pathname: string): boolean => groupOf(pathname)?.to === to;
