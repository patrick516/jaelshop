import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Pagination } from "@/types";

type Result<T> = { key: string; items: T[]; pagination: Pagination | null; error: string };

// Loads one page of a list for the current filters. Empty filters are not sent. reload() fetches the same page again
export function usePagedList<T>(path: string, params: Record<string, string>, limit = 10) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<Result<T>>({ key: "", items: [], pagination: null, error: "" });
  const key = JSON.stringify([path, params, limit, version]); // changes whenever a new request is needed

  useEffect(() => {
    let alive = true; // stops a late answer overwriting a newer one
    const query = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ""));
    api
      .get<T[]>(path, { ...query, limit })
      .then((res) => alive && setResult({ key, items: res.data, pagination: res.pagination ?? null, error: "" }))
      .catch((e: Error) => alive && setResult({ key, items: [], pagination: null, error: e.message }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const current = result.key === key; // false while a new request is running
  return { items: result.items, pagination: result.pagination, error: current ? result.error : "", loading: !current, reload: () => setVersion((v) => v + 1) };
}
