"use client"; // needs the login and loads data in the browser

import type { Order } from "@/types";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { useLoad } from "@/hooks/useLoad";
import LoadState from "@/components/shared/LoadState";
import EmptyState from "@/components/shared/EmptyState";
import OrderCard from "./OrderCard";

// The customer's own orders, newest first
export default function OrdersList() {
  const allowed = useRequireLogin();
  const { data, loading, error } = useLoad<Order[]>("/orders/mine");

  if (!allowed || !data) return <LoadState loading={loading || !allowed} error={error} />;
  if (data.length === 0) return <EmptyState message="You have no orders yet" href="/shop" label="Start Shopping" />;

  return (
    <div className="mx-auto max-w-lg space-y-3">
      <h1 className="text-2xl font-extrabold text-navy">My Orders</h1>
      {data.map((o) => (
        <OrderCard key={o.id} order={o} />
      ))}
    </div>
  );
}
