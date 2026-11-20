import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import Field from "@/components/shared/Field";
import FormDialog from "@/components/shared/FormDialog";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";
import type { CustomerRow } from "./types";

type Props = { customer: CustomerRow | null; onClose: () => void; onSaved: () => void };

// Add a customer (customer is null) or edit one
export default function CustomerDialog({ customer, onClose, onSaved }: Props) {
  const [v, setV] = useState({ firstName: customer?.firstName ?? "", lastName: customer?.lastName ?? "", phone: customer?.phone ?? "", email: customer?.email ?? "" });
  const { busy, error, run } = useSubmit();
  const set = (key: keyof typeof v) => (e: ChangeEvent<HTMLInputElement>) => setV({ ...v, [key]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const body = { firstName: v.firstName.trim(), lastName: v.lastName.trim(), phone: v.phone.trim(), email: v.email.trim() || null };
    const request = () => (customer ? api.put(`/customers/${customer.id}`, body) : api.post("/customers", body));
    if (await run(request, customer ? "Customer updated" : "Customer added")) onSaved();
  };

  return (
    <FormDialog title={customer ? "Edit customer" : "Add customer"} busy={busy} error={error} onClose={onClose} onSubmit={submit}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" htmlFor="c-first">
          <Input id="c-first" required value={v.firstName} onChange={set("firstName")} />
        </Field>
        <Field label="Last name (optional)" htmlFor="c-last">
          <Input id="c-last" value={v.lastName} onChange={set("lastName")} />
        </Field>
      </div>
      <Field label="Phone" htmlFor="c-phone" hint="Used for WhatsApp reminders and to match their orders.">
        <Input id="c-phone" type="tel" required value={v.phone} onChange={set("phone")} />
      </Field>
      <Field label="Email (optional)" htmlFor="c-email">
        <Input id="c-email" type="email" value={v.email} onChange={set("email")} />
      </Field>
    </FormDialog>
  );
}
