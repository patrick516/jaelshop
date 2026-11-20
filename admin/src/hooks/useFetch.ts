import { useEffect, useState } from "react";
import { api } from "@/lib/api";

// Loads one address from the backend. reload() fetches it again, e.g. after a save
export function useFetch<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let alive = true; // stops a late answer updating a screen that has gone
    api
      .get<T>(path)
      .then((res) => {
        if (!alive) return;
        setData(res.data);
        setError("");
      })
      .catch((e: Error) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [path, version]);

  return { data, error, loading, reload: () => setVersion((v) => v + 1) };
}
