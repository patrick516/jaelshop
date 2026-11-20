import { Link } from "react-router-dom";
import { BarChart3, Package, ShoppingCart, Warehouse } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ACTIONS = [
  { to: "/products?add=1", label: "Add Product", Icon: Package },
  { to: "/orders", label: "Manage Orders", Icon: ShoppingCart },
  { to: "/inventory", label: "Inventory", Icon: Warehouse },
  { to: "/reports", label: "View Reports", Icon: BarChart3 },
];

// Shortcuts to the pages used most
export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-navy">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {ACTIONS.map(({ to, label, Icon }) => (
          <Link key={to} to={to} className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center text-sm font-semibold text-navy hover:bg-secondary">
            <Icon size={24} className="text-orange-500" />
            {label}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
