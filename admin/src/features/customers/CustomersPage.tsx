import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import { useFetch } from "@/hooks/useFetch";
import { usePagedList } from "@/hooks/usePagedList";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import CustomerDetailDialog from "./CustomerDetailDialog";
import CustomerDialog from "./CustomerDialog";
import CustomerFilters from "./CustomerFilters";
import CustomerSummary from "./CustomerSummary";
import CustomersTable from "./CustomersTable";
import type { CustomerRow, Summary } from "./types";

type Open = { kind: "view"; id: string } | { kind: "form"; customer: CustomerRow | null } | null; // which pop-up is showing

// Only puts the customers screen together
export default function CustomersPage() {
  const { filters, change } = useUrlFilters(["search", "owing", "page"]);
  const { items, pagination, error, loading, reload } = usePagedList<CustomerRow>("/customers", filters, 10);
  const summary = useFetch<Summary>("/customers/summary");
  const [open, setOpen] = useState<Open>(null);

  const refresh = () => {
    reload();
    summary.reload();
  };

  return (
    <>
      <PageHeader title="Customers" subtitle="People who buy on loan, and what they still owe.">
        <Button onClick={() => setOpen({ kind: "form", customer: null })} className="bg-orange-500 hover:bg-orange-600">
          <Plus size={18} className="mr-2" /> Add Customer
        </Button>
      </PageHeader>

      <CustomerSummary data={summary.data} />
      <CustomerFilters filters={filters} onChange={change} />
      {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p> : <CustomersTable items={items} loading={loading} onOpen={(id) => setOpen({ kind: "view", id })} />}
      <Pagination page={Number(filters.page)} totalPages={pagination?.totalPages ?? 1} total={pagination?.total ?? 0} onPage={(p) => change({ page: String(p) })} />

      {open?.kind === "view" && <CustomerDetailDialog id={open.id} onClose={() => setOpen(null)} onEdit={(customer) => setOpen({ kind: "form", customer })} onChanged={refresh} />}
      {open?.kind === "form" && (
        <CustomerDialog
          customer={open.customer}
          onClose={() => setOpen(null)}
          onSaved={() => {
            setOpen(null);
            refresh();
          }}
        />
      )}
    </>
  );
}
