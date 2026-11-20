import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import Field from "@/components/shared/Field";
import FormDialog from "@/components/shared/FormDialog";
import OptionSelect from "@/components/shared/OptionSelect";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";
import { STAFF_STATUS_OPTIONS, type Role, type StaffMember, type StaffStatus } from "./types";

type Props = { member: StaffMember | null; roles: Role[]; onClose: () => void; onSaved: () => void };
type Text = "firstName" | "lastName" | "email" | "phone" | "password";

// Add a staff member (member is null) or edit one
export default function StaffDialog({ member, roles, onClose, onSaved }: Props) {
  const [v, setV] = useState({
    firstName: member?.firstName ?? "",
    lastName: member?.lastName ?? "",
    email: member?.email ?? "",
    phone: member?.phone ?? "",
    roleId: member?.role.id ?? "",
    password: "",
    status: (member?.status ?? "ACTIVE") as StaffStatus,
  });
  const [formError, setFormError] = useState("");
  const { busy, error, run } = useSubmit();
  const set = (key: Text) => (e: ChangeEvent<HTMLInputElement>) => setV({ ...v, [key]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!v.roleId) return setFormError("Please choose a role");
    setFormError("");
    const body = {
      firstName: v.firstName.trim(),
      lastName: v.lastName.trim(),
      email: v.email.trim(),
      phone: v.phone.trim() || null,
      roleId: v.roleId,
      ...(v.password ? { password: v.password } : {}), // an empty password would be refused, so it is left out
      ...(member ? { status: v.status } : {}),
    };
    const request = () => (member ? api.put(`/staff/${member.id}`, body) : api.post("/staff", body));
    if (await run(request, member ? "Staff member updated" : "Staff member added")) onSaved();
  };

  return (
    <FormDialog title={member ? "Edit staff member" : "Add staff member"} busy={busy} error={formError || error} onClose={onClose} onSubmit={submit}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" htmlFor="st-first">
          <Input id="st-first" required value={v.firstName} onChange={set("firstName")} />
        </Field>
        <Field label="Last name" htmlFor="st-last">
          <Input id="st-last" required value={v.lastName} onChange={set("lastName")} />
        </Field>
      </div>
      <Field label="Email" htmlFor="st-email">
        <Input id="st-email" type="email" required value={v.email} onChange={set("email")} />
      </Field>
      <Field label="Phone (optional)" htmlFor="st-phone">
        <Input id="st-phone" type="tel" value={v.phone} onChange={set("phone")} />
      </Field>
      <Field label="Role">
        <OptionSelect value={v.roleId} onChange={(roleId) => setV({ ...v, roleId })} options={roles.map((r) => ({ value: r.id, label: r.name }))} placeholder="Choose a role" />
      </Field>
      <Field label={member ? "New password (optional)" : "Password"} htmlFor="st-pass" hint={member ? "Leave empty to keep the current password." : "At least 8 characters."}>
        <Input id="st-pass" type="password" autoComplete="new-password" required={!member} minLength={8} value={v.password} onChange={set("password")} />
      </Field>
      {member && (
        <Field label="Status" hint="Inactive and suspended staff can no longer log in.">
          <OptionSelect value={v.status} onChange={(status) => setV({ ...v, status: status as StaffStatus })} options={STAFF_STATUS_OPTIONS} placeholder="Status" />
        </Field>
      )}
    </FormDialog>
  );
}
