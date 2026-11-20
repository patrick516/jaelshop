import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "./useAuth";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />; // already logged in

  const submit = async (e: FormEvent) => {
    e.preventDefault(); // stop the browser reloading the page
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy p-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
            <ShoppingBag size={24} />
          </span>
          <div className="leading-tight">
            <p className="font-extrabold text-navy">JAEL ENTERPRISE</p>
            <p className="text-xs text-muted-foreground">Shop Smart • Work Better</p>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Admin sign in</h1>
          <p className="text-sm text-muted-foreground">Staff only. Use your staff email and password.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p>}
          <Button disabled={busy} className="w-full bg-orange-500 hover:bg-orange-600">
            {busy ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
