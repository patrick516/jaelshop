import { useState, type ReactNode } from "react";
import { api } from "@/lib/api";
import { clearSession, getSession, saveSession } from "@/lib/session";
import type { Session } from "@/types";
import { AuthContext } from "./authContext";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(getSession); // read the saved login once

  const login = async (email: string, password: string) => {
    const res = await api.post<Session>("/auth/staff/login", { email, password });
    saveSession(res.data);
    setSession(res.data);
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  return <AuthContext.Provider value={{ user: session?.user ?? null, login, logout }}>{children}</AuthContext.Provider>;
}
