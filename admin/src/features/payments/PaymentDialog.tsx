import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import Field from "@/components/shared/Field";
import FormDialog from "@/components/shared/FormDialog";
import OptionSelect from "@/components/shared/OptionSelect";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";
import { formatMK } from "@/lib/format";
import { methodLabel } from "@/lib/labels";
import { PAY_STATUS_OPTIONS, type PaymentEdit } from "./types";

type Props = { payment: PaymentEdit; title: string; onClose: () => void; onSaved: () => void };

// Mark a payment as paid, failed or refunded, and keep the Airtel / TNM reference
export default function PaymentDialog({ payment, title, onClose, onSaved }: Props) {
  const [status, setStatus] = useState(payment.status);
  const [reference, setReference] = useState(payment.transactionRef ?? "");
  const { busy, error, run } = useSubmit();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const body = { status, transactionRef: reference.trim() || null };
    if (await run(() => api.patch(`/payments/${payment.id}`, body), "Payment updated")) onSaved();
  };

  return (
    <FormDialog title={`Payment for ${title}`} busy={busy} error={error} onClose={onClose} onSubmit={submit}>
      <p className="text-sm text-muted-foreground">
        {methodLabel[payment.method] ?? payment.method}, {formatMK(payment.amount)}
      </p>
      <Field label="Status">
        <OptionSelect value={status} onChange={setStatus} options={PAY_STATUS_OPTIONS} placeholder="Status" />
      </Field>
      <Field label="Reference (optional)" htmlFor="pay-ref" hint="The Airtel Money or TNM Mpamba transaction ID, so you can find it later.">
        <Input id="pay-ref" value={reference} onChange={(e) => setReference(e.target.value)} />
      </Field>
    </FormDialog>
  );
}
