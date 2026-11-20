"use client"; // keeps the login token in the browser

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Customer } from "@/types";

type AuthResult = { token: string; customer: Customer };
type RegisterInput = { firstName: string; lastName: string; email: string; phone?: string; password: string };

type AuthContextValue = {
  customer: Customer | null; // null when nobody is logged in
  token: string | null; // sent to the backend as "Authorization: Bearer <token>"
  ready: boolean; // false until the saved login has been read from the browser
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
};

const KEY = "jael-auth";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthResult | null>(null);
  const [ready, setReady] = useState(false);

  // Once, when the page opens: read the saved login
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setSession(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  // Keeps the login in state and in localStorage together
  const save = (value: AuthResult | null) => {
    setSession(value);
    try {
      if (value) localStorage.setItem(KEY, JSON.stringify(value));
      else localStorage.removeItem(KEY);
    } catch {}
  };

  const login = async (email: string, password: string) => {
    const res = await api<AuthResult>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    save(res.data);
  };

  const register = async (input: RegisterInput) => {
    const res = await api<AuthResult>("/auth/register", { method: "POST", body: JSON.stringify(input) });
    save(res.data);
  };

  const logout = () => save(null);

  return (
    <AuthContext.Provider value={{ customer: session?.customer ?? null, token: session?.token ?? null, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
