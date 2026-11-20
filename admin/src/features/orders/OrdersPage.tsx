import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import { usePagedList } from "@/hooks/usePagedList";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import OrderDialog from "./OrderDialog";
import OrderFilters from "./OrderFilters";
import OrdersTable from "./OrdersTable";
import type { OrderSummary } from "./types";

// Only puts the orders screen together
export default function OrdersPage() {
  const { filters, change } = useUrlFilters(["search", "status", "page"]);
  const { items, pagination, error, loading, reload } = usePagedList<OrderSummary>("/orders", filters, 10);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      <PageHeader title="Orders" subtitle="Every order from the website and WhatsApp. Tap an order to manage it." />
      <OrderFilters key={filters.search} filters={filters} onChange={change} />
      {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p> : <OrdersTable items={items} loading={loading} onOpen={setOpenId} />}
      <Pagination page={Number(filters.page)} totalPages={pagination?.totalPages ?? 1} total={pagination?.total ?? 0} onPage={(p) => change({ page: String(p) })} />
      {openId && <OrderDialog id={openId} onClose={() => setOpenId(null)} onChanged={reload} />}
    </>
  );
}
