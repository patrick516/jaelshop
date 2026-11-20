import { useState } from "react";
import { Button } from "@/components/ui/button";
import OptionSelect from "@/components/shared/OptionSelect";
import { useFetch } from "@/hooks/useFetch";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";
import { samePhone } from "@/lib/phone";
import { fullName, type CustomerRow } from "@/features/customers/types";
import type { OrderDetail } from "./types";

type Props = { order: OrderDetail; onChanged: () => void };

// Link this order to a customer (needed to follow a loan), or save the buyer as a new customer
export default function OrderCustomer({ order, onChanged }: Props) {
  const { data } = useFetch<CustomerRow[]>("/customers?limit=100");
  const [choice, setChoice] = useState("");
  const { busy, error, run } = useSubmit();
  const match = data?.find((c) => samePhone(c.phone, order.shippingPhone)); // same phone number as the buyer

  const link = async (customerId: string | null) => {
    const request = () => api.patch(`/orders/${order.id}/customer`, { customerId });
    if (await run(request, customerId ? "Customer linked" : "Link removed")) onChanged();
  };

  const saveAsNew = async () => {
    const [first, ...rest] = order.shippingName.trim().split(/\s+/);
    const request = async () => {
      const res = await api.post<{ id: string }>("/customers", { firstName: first, lastName: rest.join(" "), phone: order.shippingPhone });
      await api.patch(`/orders/${order.id}/customer`, { customerId: res.data.id });
    };
    if (await run(request, "Customer saved and linked")) onChanged();
  };

  return (
    <div className="space-y-3 rounded-xl border p-4 text-sm">
      <p className="font-extrabold text-navy">Customer</p>
      {order.customer ? (
        <div className="flex items-center justify-between gap-3">
          <p>
            {fullName(order.customer)} <span className="text-muted-foreground">{order.customer.phone}</span>
          </p>
          <Button variant="outline" size="sm" disabled={busy} onClick={() => link(null)}>
            Remove link
          </Button>
        </div>
      ) : (
        <>
          {match && (
            <Button disabled={busy} onClick={() => link(match.id)} className="w-full bg-orange-500 hover:bg-orange-600">
              Link to {fullName(match)} (same phone number)
            </Button>
          )}
          <div className="flex gap-2">
            <div className="flex-1">
              <OptionSelect value={choice} onChange={setChoice} options={(data ?? []).map((c) => ({ value: c.id, label: fullName(c) }))} placeholder="Choose a customer" />
            </div>
            <Button variant="outline" disabled={busy || !choice} onClick={() => link(choice)}>
              Link
            </Button>
          </div>
          {!match && (
            <Button variant="outline" disabled={busy} onClick={saveAsNew} className="w-full">
              Save {order.shippingName} as a new customer
            </Button>
          )}
        </>
      )}
      {error && <p className="rounded-lg bg-red-50 p-3 font-semibold text-destructive">{error}</p>}
    </div>
  );
}
