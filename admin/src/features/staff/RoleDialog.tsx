import { useState, type FormEvent } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Field from "@/components/shared/Field";
import FormDialog from "@/components/shared/FormDialog";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";
import { PERMISSIONS, type Role } from "./types";

type Props = { role: Role | null; onClose: () => void; onSaved: () => void };

// Add a role (role is null) or edit one, and tick the areas it may use
export default function RoleDialog({ role, onClose, onSaved }: Props) {
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [perms, setPerms] = useState<string[]>(role?.permissions ?? []);
  const { busy, error, run } = useSubmit();

  const toggle = (key: string, on: boolean) => setPerms((p) => (on ? [...p, key] : p.filter((x) => x !== key)));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const body = { name: name.trim(), description: description.trim() || null, permissions: perms };
    const request = () => (role ? api.put(`/staff/roles/${role.id}`, body) : api.post("/staff/roles", body));
    if (await run(request, role ? "Role updated" : "Role created")) onSaved();
  };

  return (
    <FormDialog title={role ? "Edit role" : "Add role"} busy={busy} error={error} onClose={onClose} onSubmit={submit}>
      <Field label="Role name" htmlFor="role-name">
        <Input id="role-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sales Assistant" />
      </Field>
      <Field label="Description (optional)" htmlFor="role-desc">
        <Input id="role-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <div className="space-y-2">
        <p className="text-sm font-medium">What can this role use?</p>
        <div className="grid grid-cols-2 gap-2">
          {PERMISSIONS.map((p) => (
            <label key={p.key} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={perms.includes(p.key)} onCheckedChange={(on) => toggle(p.key, on === true)} />
              {p.label}
            </label>
          ))}
        </div>
      </div>
    </FormDialog>
  );
}
