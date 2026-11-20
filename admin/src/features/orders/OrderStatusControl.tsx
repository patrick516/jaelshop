import { useState } from "react";
import { Button } from "@/components/ui/button";
import OptionSelect from "@/components/shared/OptionSelect";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";
import { CLOSED, STATUS_OPTIONS, type OrderDetail } from "./types";

// Change the status of an order. Cancelled and refunded orders are locked
export default function OrderStatusControl({ order, onChanged }: { order: OrderDetail; onChanged: () => void }) {
  const [status, setStatus] = useState<string>(order.status);
  const { busy, error, run } = useSubmit();

  const save = async () => {
    if (await run(() => api.patch(`/orders/${order.id}/status`, { status }), "Order status updated")) onChanged();
  };

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <p className="font-extrabold text-navy">Order status</p>
      {CLOSED.includes(order.status) ? (
        <p className="text-sm text-muted-foreground">This order is {order.status.toLowerCase()} and can no longer be changed.</p>
      ) : (
        <>
          <div className="flex gap-2">
            <div className="flex-1">
              <OptionSelect value={status} onChange={setStatus} options={STATUS_OPTIONS} placeholder="Status" />
            </div>
            <Button onClick={save} disabled={busy || status === order.status} className="bg-orange-500 hover:bg-orange-600">
              {busy ? "Saving..." : "Update"}
            </Button>
          </div>
          {status === "CANCELLED" && <p className="text-xs text-muted-foreground">Cancelling puts the items back in stock.</p>}
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p>}
        </>
      )}
    </div>
  );
}
