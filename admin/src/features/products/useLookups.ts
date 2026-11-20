import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export type Option = { id: string; name: string; slug: string };
type Raw = Option & { children?: Raw[] }; // a category can have sub-categories

// Puts sub-categories in the same list as "Parent › Child". Duplicates are dropped
const flatten = (list: Raw[]): Option[] => {
  const all = list.flatMap((c) => [{ id: c.id, name: c.name, slug: c.slug }, ...(c.children ?? []).map((s) => ({ id: s.id, name: `${c.name} › ${s.name}`, slug: s.slug }))]);
  return [...new Map(all.map((o) => [o.id, o])).values()];
};

// The categories and brands that fill the dropdowns
export function useLookups() {
  const [categories, setCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);

  useEffect(() => {
    api.get<Raw[]>("/categories").then((res) => setCategories(flatten(res.data))).catch(() => {});
    api.get<Raw[]>("/brands").then((res) => setBrands(res.data.map(({ id, name, slug }) => ({ id, name, slug })))).catch(() => {});
  }, []);

  return { categories, brands };
}
