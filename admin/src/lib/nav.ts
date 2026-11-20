import { Award, BarChart3, CreditCard, Home, Megaphone, Package, ScrollText, Settings, ShoppingCart, Tags, UserCog, Users, Warehouse, type LucideIcon } from "lucide-react";

export type NavItem = { to: string; label: string; Icon: LucideIcon };

// The sidebar menu, in the order of the design
export const NAV: NavItem[] = [
  { to: "/", label: "Dashboard", Icon: Home },
  { to: "/products", label: "Products", Icon: Package },
  { to: "/categories", label: "Categories", Icon: Tags },
  { to: "/brands", label: "Brands", Icon: Award },
  { to: "/orders", label: "Orders", Icon: ShoppingCart },
  { to: "/customers", label: "Customers", Icon: Users },
  { to: "/inventory", label: "Inventory", Icon: Warehouse },
  { to: "/payments", label: "Payments", Icon: CreditCard },
  { to: "/reports", label: "Reports", Icon: BarChart3 },
  { to: "/marketing", label: "Marketing", Icon: Megaphone },
  { to: "/settings", label: "Settings", Icon: Settings },
  { to: "/staff", label: "Staff Users", Icon: UserCog },
  { to: "/activity-logs", label: "Activity Logs", Icon: ScrollText },
];
