import { useSearchParams } from "react-router-dom";

export type Filters = { search: string; category: string; status: string; page: string };

// The filters live in the address, e.g. /products?search=pen&page=2, so a refresh keeps them
export function useProductFilters() {
  const [params, setParams] = useSearchParams();
  const filters: Filters = {
    search: params.get("search") ?? "",
    category: params.get("category") ?? "",
    status: params.get("status") ?? "",
    page: params.get("page") ?? "1",
  };

  // Changing a filter goes back to page 1, unless the page itself is what changed
  const change = (next: Partial<Filters>) => {
    const merged = { ...filters, page: "1", ...next };
    const q = new URLSearchParams();
    (Object.keys(merged) as (keyof Filters)[]).forEach((k) => {
      if (merged[k] && !(k === "page" && merged[k] === "1")) q.set(k, merged[k]);
    });
    setParams(q);
  };

  return { filters, change };
}
