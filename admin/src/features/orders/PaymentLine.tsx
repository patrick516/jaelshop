import { Button } from "@/components/ui/button";
import { formatMK } from "@/lib/format";
import { methodLabel } from "@/lib/labels";
import PaymentStatusBadge from "@/features/payments/PaymentStatusBadge";
import type { Payment } from "./types";

type Props = { payment: Payment; onUpdate: (payment: Payment) => void };

// One payment of an order: method, amount, reference, status and an Update button
export default function PaymentLine({ payment: p, onUpdate }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p>
          {methodLabel[p.method] ?? p.method}, {formatMK(p.amount)}
          {p.status === "PENDING" && <span className="text-muted-foreground"> (still waiting)</span>}
        </p>
        {p.transactionRef && <p className="text-xs text-muted-foreground">Ref: {p.transactionRef}</p>}
      </div>
      <div className="flex items-center gap-2">
        <PaymentStatusBadge status={p.status} />
        <Button variant="outline" size="sm" onClick={() => onUpdate(p)}>
          Update
        </Button>
      </div>
    </div>
  );
}
