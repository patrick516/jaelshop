"use client"; // form state

import { useState } from "react";
import { toast } from "sonner";
import type { Profile } from "@/types";
import { useAuthedApi } from "@/hooks/useAuthedApi";
import { field } from "@/lib/styles";

type Props = { profile: Profile; onSaved: (p: Profile) => void; onCancel: () => void };

// Edit name and phone. The email stays as it is
export default function ProfileForm({ profile, onSaved, onCancel }: Props) {
  const call = useAuthedApi();
  const [form, setForm] = useState({ firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone ?? "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const updated = await call<Profile>("/customers/me", { method: "PUT", body: JSON.stringify({ ...form, phone: form.phone.trim() || null }) });
      toast.success("Profile updated");
      onSaved(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border bg-white p-4">
      <h2 className="font-extrabold text-navy">Edit profile</h2>
      <div className="grid grid-cols-2 gap-3">
        <input required value={form.firstName} onChange={set("firstName")} placeholder="First name" className={field} />
        <input required value={form.lastName} onChange={set("lastName")} placeholder="Last name" className={field} />
      </div>
      <input type="tel" value={form.phone} onChange={set("phone")} placeholder="Phone" className={field} />
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p>}
      <div className="flex gap-2">
        <button disabled={busy} className="min-h-11 flex-1 rounded-full bg-orange-500 py-2.5 font-bold text-white disabled:opacity-60">
          {busy ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="min-h-11 flex-1 rounded-full border py-2.5 font-bold text-navy">
          Cancel
        </button>
      </div>
    </form>
  );
}
