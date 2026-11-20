"use client"; // uses state and effects

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/store/auth";
import { useAuthedApi } from "./useAuthedApi";

// Loads one address from the backend once the visitor is logged in.
// reload() fetches again. setData() lets a screen update its copy without fetching
export function useLoad<T>(path: string) {
  const { token } = useAuth();
  const call = useAuthedApi();
  const callRef = useRef(call);
  callRef.current = call; // always the latest, which keeps load() below stable

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setData(await callRef.current<T>(path));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
    setLoading(false);
  }, [path]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  return { data, loading, error, reload: load, setData };
}
