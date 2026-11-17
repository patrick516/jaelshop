import { api } from "@/lib/api";
import type { Category, Product, Settings, Pagination } from "@/types";
export const getCategories = async () =>
  (await api<Category[]>("/categories")).data;

export const getSettings = async () => (await api<Settings>("/settings")).data;

export async function getProducts(
  params: Record<string, string> = {},
): Promise<{ items: Product[]; pagination: Pagination }> {
  const query = new URLSearchParams(params).toString(); // turns the object into "featured=true&limit=8"
  const res = await api<Product[]>(`/products${query ? `?${query}` : ""}`);
  return { items: res.data, pagination: res.pagination! }; // the list route always sends pagination
}

export const getProductBySlug = async (slug: string) =>
  (await api<Product>(`/products/slug/${slug}`)).data;
