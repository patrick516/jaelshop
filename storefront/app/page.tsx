import Link from "next/link";
import { getCategories, getProducts } from "@/services/catalog";
import CategoryCards from "@/components/categories/CategoryCards";
import ProductCard from "@/components/products/ProductCard";

// A server component: it asks the backend for data and sends finished HTML
export default async function Home() {
  // Both requests run at the same time
  const [categories, featured] = await Promise.all([getCategories(), getProducts({ featured: "true", limit: "8" })]);

  return (
    <div className="space-y-8">
      {/* Hero banner */}
      <section className="rounded-2xl bg-navy p-6 text-white md:p-10">
        <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
          Shop Smart
          <br />
          <span className="text-orange-500">Live Better</span>
        </h1>
        <p className="mt-3 max-w-md text-sm text-white/80">Stationery, Office Equipment, Electronics &amp; Clothing</p>
        <Link href="/shop" className="mt-5 inline-block rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold">
          Shop Now →
        </Link>
      </section>

      {/* The 4 category cards */}
      <CategoryCards categories={categories} />

      {/* Featured products */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-navy">Featured Products</h2>
          <Link href="/shop" className="text-sm font-semibold text-orange-500">
            View All →
          </Link>
        </div>
        {featured.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {featured.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
