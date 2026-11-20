"use client"; // uses the router and the login

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";

// For pages that need a login. Sends visitors to /login and returns true once they are logged in
export function useRequireLogin(): boolean {
  const { customer, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !customer) router.replace("/login");
  }, [ready, customer, router]);

  return ready && !!customer;
}
