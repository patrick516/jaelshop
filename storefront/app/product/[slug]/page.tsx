import { notFound } from "next/navigation";
import { getProductBySlug, getSettings } from "@/services/catalog";
import { ApiRequestError } from "@/lib/api";
import ProductDetail from "@/components/products/ProductDetail";

// Server component: loads the product and the shop settings, then hands them to the interactive part
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Next.js 16 sends address parts as a Promise

  const [product, settings] = await Promise.all([
    getProductBySlug(slug).catch((e) => {
      if (e instanceof ApiRequestError && e.status === 404) notFound(); // unknown slug shows the 404 page
      throw e; // any other error is a real problem, so let it show
    }),
    getSettings(),
  ]);

  return <ProductDetail product={product} settings={settings} />;
}
