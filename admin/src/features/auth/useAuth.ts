import { useContext } from "react";
import { AuthContext } from "./authContext";

// Screens call this to read the logged-in staff member or to log in and out
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
