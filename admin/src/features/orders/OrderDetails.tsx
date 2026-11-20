import type { OrderDetail } from "./types";

// Where the order goes, and the buyer's notes
export default function OrderDetails({ order }: { order: OrderDetail }) {
  const address = [order.shippingAddress, order.shippingArea, order.shippingDistrict].filter(Boolean).join(", ");

  return (
    <div className="space-y-3 rounded-xl border p-4 text-sm">
      <div>
        <p className="font-extrabold text-navy">Delivery</p>
        <p>
          {order.shippingName}, {order.shippingPhone}
        </p>
        <p className="text-muted-foreground">{address}</p>
      </div>
      {order.notes && (
        <div>
          <p className="font-extrabold text-navy">Notes</p>
          <p className="text-muted-foreground">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
