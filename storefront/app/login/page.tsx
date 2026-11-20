"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";

const field = "w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); // stop the browser reloading the page
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-4 py-6">
      <h1 className="text-2xl font-extrabold text-navy">Welcome back</h1>
      <p className="text-sm text-muted-foreground">Log in to track your orders and save your details.</p>
      <form onSubmit={submit} className="space-y-3">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={field} />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={field} />
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p>}
        <button disabled={busy} className="min-h-11 w-full rounded-full bg-orange-500 py-3 font-bold text-white disabled:opacity-60">
          {busy ? "Logging in..." : "Log In"}
        </button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/register" className="font-semibold text-orange-500">
          Create an account
        </Link>
      </p>
    </div>
  );
}
