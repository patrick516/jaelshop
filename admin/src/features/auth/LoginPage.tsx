import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ShoppingBag, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

  if (user) return <Navigate to="/" replace />; // already logged in

  const submit = async (e: FormEvent) => {
    e.preventDefault();
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
    // Main background is a very light slate, matching the reference
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] p-4 font-sans">
      {/* 1. Logo & Header (Outside the card) */}
      <div className="mb-8 flex flex-col items-center text-center">
        {/* Logo - floating, no border box */}
        <div className="mb-4">
          <ShoppingBag className="h-10 w-10 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold text-[#0F172A]">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to manage your store and orders.
        </p>
      </div>

      {/* 2. The White Form Card */}
      <div className="w-full max-w-[420px] space-y-6 rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <form onSubmit={submit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                type="email"
                required
                autoComplete="username"
                placeholder="admin@jael.mw"
                className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-orange-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="pl-10 pr-10 bg-slate-50 border-slate-200 focus-visible:ring-orange-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <label
                htmlFor="remember"
                className="text-sm text-slate-500 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-blue-800 hover:text-blue-700"
            >
              Forgot password?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <Button
            disabled={busy}
            className="w-full bg-orange-500 text-white hover:bg-orange-600 h-11 text-base font-semibold rounded-xl"
          >
            {busy ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/* Footer inside the card */}
        <div className="text-center text-sm text-slate-500 pt-2">
          Don't have an account?{" "}
          <a href="#" className="font-medium text-blue-800 hover:text-blue-700">
            Create one
          </a>
        </div>
      </div>

      {/* 3. Optional Page Footer (Outside the card) */}
      <div className="mt-12 text-xs text-slate-400">
        © {new Date().getFullYear()} JAEL ENTERPRISE. All rights reserved.
      </div>
    </div>
  );
}
