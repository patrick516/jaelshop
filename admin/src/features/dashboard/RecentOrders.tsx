import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatMK } from "@/lib/format";
import { methodLabel } from "@/lib/labels";
import OrderStatusBadge from "@/features/orders/OrderStatusBadge";
import type { DashboardData } from "./types";

// The latest 5 orders, with a link to the full list
export default function RecentOrders({ orders }: { orders: DashboardData["recentOrders"] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg text-navy">Recent Orders</CardTitle>
        <Link to="/orders" className="text-sm font-semibold text-orange-500">
          View All →
        </Link>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No orders yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="hidden md:table-cell">Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-semibold text-navy">{o.orderNumber}</TableCell>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell className="hidden sm:table-cell">{o.items}</TableCell>
                  <TableCell className="font-semibold">{formatMK(o.total)}</TableCell>
                  <TableCell className="hidden md:table-cell">{o.paymentMethod ? (methodLabel[o.paymentMethod] ?? o.paymentMethod) : "-"}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={o.status} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{formatDate(o.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
