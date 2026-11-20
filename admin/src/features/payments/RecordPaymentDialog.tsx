import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import Field from "@/components/shared/Field";
import FormDialog from "@/components/shared/FormDialog";
import OptionSelect from "@/components/shared/OptionSelect";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";
import { formatMK } from "@/lib/format";

const METHODS = [
  { value: "CASH_ON_DELIVERY", label: "Cash" },
  { value: "AIRTEL_MONEY", label: "Airtel Money" },
  { value: "TNM_MPAMBA", label: "TNM Mpamba" },
  { value: "BANK_TRANSFER", label: "Bank transfer" },
];

type Props = { orderId: string; orderNumber: string; balance: number; onClose: () => void; onSaved: () => void };

// Record money received for an order. It can be less than the balance (an installment)
export default function RecordPaymentDialog({ orderId, orderNumber, balance, onClose, onSaved }: Props) {
  const [amount, setAmount] = useState(String(balance));
  const [method, setMethod] = useState("CASH_ON_DELIVERY");
  const [reference, setReference] = useState("");
  const { busy, error, run } = useSubmit();
  const left = balance - (Number(amount) || 0);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const body = { amount: Number(amount), method, transactionRef: reference.trim() || null };
    if (await run(() => api.post(`/payments/orders/${orderId}`, body), "Payment recorded")) onSaved();
  };

  return (
    <FormDialog title={`Record payment: ${orderNumber}`} busy={busy} error={error} onClose={onClose} onSubmit={submit}>
      <Field label="Amount received (MWK)" htmlFor="rp-amount" hint={`Balance now ${formatMK(balance)}. After this: ${left < 0 ? "more than the balance" : formatMK(left)}.`}>
        <Input id="rp-amount" type="number" min={0.01} max={balance} step="any" required value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Field>
      <Field label="Paid by">
        <OptionSelect value={method} onChange={setMethod} options={METHODS} placeholder="Method" />
      </Field>
      <Field label="Reference (optional)" htmlFor="rp-ref" hint="The Airtel Money or TNM Mpamba transaction ID.">
        <Input id="rp-ref" value={reference} onChange={(e) => setReference(e.target.value)} />
      </Field>
    </FormDialog>
  );
}
