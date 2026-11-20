"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";

const field = "w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Returns an onChange handler for one field, e.g. set("email")
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register({ ...form, phone: form.phone.trim() || undefined }); // an empty phone is sent as nothing
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-4 py-6">
      <h1 className="text-2xl font-extrabold text-navy">Create account</h1>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input required value={form.firstName} onChange={set("firstName")} placeholder="First name" className={field} />
          <input required value={form.lastName} onChange={set("lastName")} placeholder="Last name" className={field} />
        </div>
        <input type="email" required value={form.email} onChange={set("email")} placeholder="Email" className={field} />
        <input type="tel" value={form.phone} onChange={set("phone")} placeholder="Phone (optional)" className={field} />
        <input type="password" required minLength={8} value={form.password} onChange={set("password")} placeholder="Password (8+ characters)" className={field} />
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p>}
        <button disabled={busy} className="min-h-11 w-full rounded-full bg-orange-500 py-3 font-bold text-white disabled:opacity-60">
          {busy ? "Creating..." : "Create Account"}
        </button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-orange-500">
          Log in
        </Link>
      </p>
    </div>
  );
}
