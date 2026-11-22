import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/useFetch";
import { formatDateTime } from "@/lib/format";
import { sourceLabel } from "@/lib/labels";
import CustomerWhatsApp from "./CustomerWhatsApp";
import OrderCustomer from "./OrderCustomer";
import OrderDetails from "./OrderDetails";
import OrderItemsList from "./OrderItemsList";
import OrderPayments from "./OrderPayments";
import OrderSell from "./OrderSell";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderStatusControl from "./OrderStatusControl";
import type { OrderDetail } from "./types";

type Props = { id: string; onClose: () => void; onChanged: () => void };

// The pop-up for one order. Mount it only while it should be visible
export default function OrderDialog({ id, onClose, onChanged }: Props) {
  const {
    data: order,
    error,
    loading,
    reload,
  } = useFetch<OrderDetail>(`/orders/${id}`);
  const changed = () => {
    reload();
    onChanged();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-navy">
            {order?.orderNumber ?? "Order"}
            {order && <OrderStatusBadge status={order.status} />}
          </DialogTitle>
          <DialogDescription>
            {order
              ? `${formatDateTime(order.createdAt)} · ${sourceLabel[order.source] ?? order.source}`
              : "Loading..."}
          </DialogDescription>
        </DialogHeader>

        {loading && <Skeleton className="h-64 w-full" />}
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">
            {error}
          </p>
        )}
        {order && (
          <div className="space-y-4">
            <OrderItemsList order={order} />
            <OrderDetails order={order} />
            <OrderCustomer order={order} onChanged={changed} />
            <OrderPayments order={order} onChanged={changed} />
            <OrderSell order={order} onChanged={changed} />
            <OrderStatusControl order={order} onChanged={changed} />
            <CustomerWhatsApp orderId={order.id} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
