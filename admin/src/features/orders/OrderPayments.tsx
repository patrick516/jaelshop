import { useState } from "react";
import { Button } from "@/components/ui/button";
import PaymentDialog from "@/features/payments/PaymentDialog";
import RecordPaymentDialog from "@/features/payments/RecordPaymentDialog";
import PaymentLine from "./PaymentLine";
import PaymentTotals from "./PaymentTotals";
import { balanceOf, paidTotal } from "./money";
import { CLOSED, type OrderDetail, type Payment } from "./types";

// Total, paid and balance, every payment, and a button to record an installment
export default function OrderPayments({ order, onChanged }: { order: OrderDetail; onChanged: () => void }) {
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
      <PaymentTotals total={order.total} paid={paidTotal(order.payments)} balance={balance} />
      {order.payments.map((p) => (
        <PaymentLine key={p.id} payment={p} onUpdate={setEditing} />
      ))}
      {canRecord && (
        <Button onClick={() => setRecording(true)} className="w-full bg-orange-500 hover:bg-orange-600">
          Record payment
        </Button>
      )}
      {editing && <PaymentDialog payment={editing} title={order.orderNumber} onClose={() => setEditing(null)} onSaved={done} />}
      {recording && <RecordPaymentDialog orderId={order.id} orderNumber={order.orderNumber} balance={balance} onClose={() => setRecording(false)} onSaved={done} />}
    </div>
  );
}
