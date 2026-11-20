import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Pagination } from "@/types";
import type { Product } from "./types";
import type { Filters } from "./useProductFilters";

type Result = { key: string; items: Product[]; pagination: Pagination | null; error: string };

// Loads one page of products for the current filters. reload() fetches the same page again
export function useProducts(filters: Filters) {
  const { search, category, status, page } = filters;
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<Result>({ key: "", items: [], pagination: null, error: "" });
  const key = [search, category, status, page, version].join("|"); // changes whenever a new request is needed

  useEffect(() => {
    let alive = true; // stops a late answer overwriting a newer one
    api
      .get<Product[]>("/products/all", { search: search || undefined, category: category || undefined, status: status || undefined, page, limit: 10 })
      .then((res) => {
        if (alive) setResult({ key, items: res.data, pagination: res.pagination ?? null, error: "" });
      })
      .catch((e: Error) => {
        if (alive) setResult({ key, items: [], pagination: null, error: e.message });
      });
    return () => {
      alive = false;
    };
  }, [key, search, category, status, page]);

  const current = result.key === key; // false while a new request is running
  return { items: result.items, pagination: result.pagination, error: current ? result.error : "", loading: !current, reload: () => setVersion((v) => v + 1) };
}
