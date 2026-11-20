"use client"; // reads the login from the browser

import { api, ApiRequestError } from "@/lib/api";
import { useAuth } from "@/store/auth";

// Gives a function that calls the backend as the logged-in customer and returns just the data.
// An expired login (401) logs the visitor out
export function useAuthedApi() {
  const { token, logout } = useAuth();

  return async function call<T>(path: string, options: RequestInit = {}): Promise<T> {
    try {
      const res = await api<T>(path, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } });
      return res.data;
    } catch (e) {
      if (e instanceof ApiRequestError && e.status === 401) logout();
      throw e;
    }
  };
}
