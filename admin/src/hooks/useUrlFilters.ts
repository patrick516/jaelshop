import { useSearchParams } from "react-router-dom";

// Keeps list filters in the address, e.g. /orders?status=PENDING&page=2, so a refresh keeps them.
// keys must include "page"
export function useUrlFilters(keys: readonly string[]) {
  const [params, setParams] = useSearchParams();
  const filters: Record<string, string> = {};
  keys.forEach((k) => {
    filters[k] = params.get(k) ?? (k === "page" ? "1" : "");
  });

  // Changing a filter goes back to page 1, unless the page itself is what changed
  const change = (next: Record<string, string>) => {
    const merged = { ...filters, page: "1", ...next };
    const q = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v && !(k === "page" && v === "1")) q.set(k, v);
    });
    setParams(q);
  };

  return { filters, change };
}
