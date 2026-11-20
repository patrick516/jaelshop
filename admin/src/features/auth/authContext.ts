import { createContext } from "react";
import type { StaffUser } from "@/types";

export type AuthValue = {
  user: StaffUser | null; // null when nobody is logged in
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthValue | null>(null);
