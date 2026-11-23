import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

export type Option = { id: string; name: string; slug: string };
type Raw = Option & { children?: Raw[] }; // a category can have sub-categories

// Puts sub-categories in the same list as "Parent › Child". Duplicates are dropped
const flatten = (list: Raw[]): Option[] => {
  const all = list.flatMap((c) => [
    { id: c.id, name: c.name, slug: c.slug },
    ...(c.children ?? []).map((s) => ({
      id: s.id,
      name: `${c.name} › ${s.name}`,
      slug: s.slug,
    })),
  ]);
  return [...new Map(all.map((o) => [o.id, o])).values()];
};

// The categories and brands that fill the dropdowns
export function useLookups() {
  const [categories, setCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);

  useEffect(() => {
    api
      .get<Raw[]>("/categories")
      .then((res) => setCategories(flatten(res.data)))
      .catch(() => {});
    api
      .get<Raw[]>("/brands")
      .then((res) =>
        setBrands(res.data.map(({ id, name, slug }) => ({ id, name, slug }))),
      )
      .catch(() => {});
  }, []);

  // Saves a new category or brand, adds it to the list and hands it back, so the form can select it right away
  const create = async (
    kind: "categories" | "brands",
    name: string,
  ): Promise<Option> => {
    try {
      const res = await api.post<Option>(`/${kind}`, { name });
      const made = {
        id: res.data.id,
        name: res.data.name,
        slug: res.data.slug,
      };
      (kind === "categories" ? setCategories : setBrands)((list) => [
        ...list,
        made,
      ]);
      return made;
    } catch (e) {
      // The backend refuses a name that makes the same web address (slug) as an existing one
      if (e instanceof ApiError && e.status === 409)
        throw new Error(
          `A similar ${kind === "categories" ? "category" : "brand"} already exists. Pick it from the list.`,
        );
      throw e;
    }
  };

  return {
    categories,
    brands,
    createCategory: (name: string) => create("categories", name),
    createBrand: (name: string) => create("brands", name),
  };
}
