import Link from "next/link";
import { getCategories, getProducts } from "@/services/catalog";
import type { Filters } from "@/lib/shopUrl";
import ProductCard from "@/components/products/ProductCard";
import CategoryChips from "@/components/products/CategoryChips";
import Pagination from "@/components/shared/Pagination";

// In Next.js 16 the address filters arrive as a Promise, so we await them
export default async function ShopPage({ searchParams }: { searchParams: Promise<Filters> }) {
  const { category, search, page = "1" } = await searchParams;

  // Only filters that were given are sent to the backend
  const params: Record<string, string> = { limit: "12", page };
  if (category) params.category = category;
  if (search) params.search = search;

  // Both requests run at the same time
  const [categories, { items, pagination }] = await Promise.all([getCategories(), getProducts(params)]);

  // The heading says what the visitor is looking at
  const title = search ? `Results for "${search}"` : (categories.find((c) => c.slug === category)?.name ?? "All Products");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">{title}</h1>
        <p className="text-sm text-muted-foreground">
          {pagination.total} {pagination.total === 1 ? "product" : "products"} found
        </p>
      </div>

      <CategoryChips categories={categories} active={category} search={search} />

      {items.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="font-semibold text-navy">No products found</p>
          <Link href="/shop" className="mt-2 inline-block text-sm font-semibold text-orange-500">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination current={Number(page)} totalPages={pagination.totalPages} filters={{ category, search }} />
    </div>
  );
}
