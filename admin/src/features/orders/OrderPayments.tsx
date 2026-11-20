import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatMK } from "@/lib/format";
import { methodLabel } from "@/lib/labels";
import PaymentDialog from "@/features/payments/PaymentDialog";
import PaymentStatusBadge from "@/features/payments/PaymentStatusBadge";
import RecordPaymentDialog from "@/features/payments/RecordPaymentDialog";
import { balanceOf, paidTotal } from "./money";
import { CLOSED, type OrderDetail, type Payment } from "./types";

const Box = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) => (
  <div className="rounded-lg bg-secondary p-2">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`font-bold ${tone ?? "text-navy"}`}>{value}</p>
  </div>
);

// Total, paid and balance, every payment, and a button to record an installment
export default function OrderPayments({
  order,
  onChanged,
}: {
  order: OrderDetail;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<Payment | null>(null);
  const [recording, setRecording] = useState(false);
  const balance = balanceOf(order);
  const canRecord = balance > 0 && !CLOSED.includes(order.status);
  const done = () => {
    setEditing(null);
    setRecording(false);
    onChanged();
  };

  return (
    <div className="space-y-3 rounded-xl border p-4 text-sm">
      <p className="font-extrabold text-navy">Payments</p>
      <div className="grid grid-cols-3 gap-2 text-center">
        <Box label="Total" value={formatMK(order.total)} />
        <Box
          label="Paid"
          value={formatMK(paidTotal(order.payments))}
          tone="text-green-600"
        />
        <Box
          label="Balance"
          value={formatMK(balance)}
          tone={balance > 0 ? "text-destructive" : "text-green-600"}
        />
      </div>

      {order.payments.map((p) => (
        <div key={p.id} className="flex items-center justify-between gap-3">
          <div>
            <p>
              {methodLabel[p.method] ?? p.method}, {formatMK(p.amount)}
              {p.status === "PENDING" && (
                <span className="text-muted-foreground"> (still waiting)</span>
              )}
            </p>
            {p.transactionRef && (
              <p className="text-xs text-muted-foreground">
                Ref: {p.transactionRef}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <PaymentStatusBadge status={p.status} />
            <Button variant="outline" size="sm" onClick={() => setEditing(p)}>
              Update
            </Button>
          </div>
        </div>
      ))}

      {canRecord && (
        <Button
          onClick={() => setRecording(true)}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          Record payment
        </Button>
      )}
      {editing && (
        <PaymentDialog
          payment={editing}
          title={order.orderNumber}
          onClose={() => setEditing(null)}
          onSaved={done}
        />
      )}
      {recording && (
        <RecordPaymentDialog
          orderId={order.id}
          orderNumber={order.orderNumber}
          balance={balance}
          onClose={() => setRecording(false)}
          onSaved={done}
        />
      )}
    </div>
  );
}
