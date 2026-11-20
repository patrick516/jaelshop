import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";

// Wraps every page that needs a login. Visitors without one are sent to /login
export default function ProtectedRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
