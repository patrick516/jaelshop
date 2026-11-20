import OrderDetail from "@/components/account/OrderDetail";

// In Next.js 16 the address parts arrive as a Promise
export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}
