import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QueryState from "@/components/shared/QueryState";
import StatCard from "@/components/shared/StatCard";
import { useFetch } from "@/hooks/useFetch";
import { formatMK } from "@/lib/format";
import RecordPaymentDialog from "@/features/payments/RecordPaymentDialog";
import CustomerOrdersList from "./CustomerOrdersList";
import ReminderButton from "./ReminderButton";
import { fullName, type CustomerDetail, type CustomerOrder } from "./types";

type Props = { id: string; onClose: () => void; onEdit: (c: CustomerDetail) => void; onChanged: () => void };

// The pop-up for one customer: what they owe, their orders and a payment button for each
export default function CustomerDetailDialog({ id, onClose, onEdit, onChanged }: Props) {
  const { data: c, error, loading, reload } = useFetch<CustomerDetail>(`/customers/${id}`);
  const [paying, setPaying] = useState<CustomerOrder | null>(null);

  return (
    <>
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-navy">{c ? fullName(c) : "Customer"}</DialogTitle>
            <DialogDescription>{c ? [c.phone, c.email].filter(Boolean).join(" · ") || "No contact details" : "Loading..."}</DialogDescription>
          </DialogHeader>

          {!c ? (
            <QueryState loading={loading} error={error} />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <StatCard label="Bought" value={formatMK(c.ordered)} />
                <StatCard label="Paid" value={formatMK(c.paid)} />
                <StatCard label="Owes" value={formatMK(c.balance)} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => onEdit(c)}>
                  <Pencil size={16} className="mr-2" /> Edit
                </Button>
                <ReminderButton name={c.firstName} phone={c.phone} balance={c.balance} />
              </div>
              <CustomerOrdersList orders={c.orders} onPay={setPaying} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {paying && (
        <RecordPaymentDialog
          orderId={paying.id}
          orderNumber={paying.orderNumber}
          balance={paying.balance}
          onClose={() => setPaying(null)}
          onSaved={() => {
            setPaying(null);
            reload();
            onChanged();
          }}
        />
      )}
    </>
  );
}
