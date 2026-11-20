import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import { usePagedList } from "@/hooks/usePagedList";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import PaymentDialog from "./PaymentDialog";
import PaymentFilters from "./PaymentFilters";
import PaymentsTable from "./PaymentsTable";
import type { PaymentRow } from "./types";

// Only puts the payments screen together
export default function PaymentsPage() {
  const { filters, change } = useUrlFilters(["status", "method", "page"]);
  const { items, pagination, error, loading, reload } = usePagedList<PaymentRow>("/payments", filters, 10);
  const [editing, setEditing] = useState<PaymentRow | null>(null);

  return (
    <>
      <PageHeader title="Payments" subtitle="Money is paid outside the website. Mark each payment as paid here when it arrives." />
      <PaymentFilters filters={filters} onChange={change} />
      {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p> : <PaymentsTable items={items} loading={loading} onUpdate={setEditing} />}
      <Pagination page={Number(filters.page)} totalPages={pagination?.totalPages ?? 1} total={pagination?.total ?? 0} onPage={(p) => change({ page: String(p) })} />
      {editing && (
        <PaymentDialog
          payment={editing}
          title={editing.order.orderNumber}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      )}
    </>
  );
}
