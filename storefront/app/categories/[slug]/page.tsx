import { redirect } from "next/navigation";

// The category cards link to /categories/stationery. The shop page does the real work,
// so this page just sends the visitor to /shop?category=stationery
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // in Next.js 16 the address parts arrive as a Promise too
  redirect(`/shop?category=${encodeURIComponent(slug)}`);
}
