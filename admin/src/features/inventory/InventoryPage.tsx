import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import { usePagedList } from "@/hooks/usePagedList";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import AddVariantDialog from "./AddVariantDialog";
import AdjustDialog from "./AdjustDialog";
import EditVariantDialog from "./EditVariantDialog";
import HistoryDialog from "./HistoryDialog";
import InventoryFilters from "./InventoryFilters";
import InventoryTable from "./InventoryTable";
import type { StockRow } from "./types";

type Open = { kind: "adjust" | "history" | "edit"; row: StockRow } | { kind: "add" } | null; // which pop-up is showing

// Only puts the inventory screen together
export default function InventoryPage() {
  const { filters, change } = useUrlFilters(["search", "lowStock", "page"]);
  const { items, pagination, error, loading, reload } = usePagedList<StockRow>("/inventory", filters, 15);
  const [open, setOpen] = useState<Open>(null);
  const close = () => setOpen(null);
  const saved = () => {
    close();
    reload();
  };

  return (
    <>
      <PageHeader title="Inventory" subtitle="Sizes, colours and how many you have of each.">
        <Button onClick={() => setOpen({ kind: "add" })} className="bg-orange-500 hover:bg-orange-600">
          <Plus size={18} className="mr-2" /> Add Size / Colour
        </Button>
      </PageHeader>

      <InventoryFilters key={filters.search} filters={filters} onChange={change} />
      {error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p>
      ) : (
        <InventoryTable items={items} loading={loading} onAdjust={(row) => setOpen({ kind: "adjust", row })} onHistory={(row) => setOpen({ kind: "history", row })} onEdit={(row) => setOpen({ kind: "edit", row })} />
      )}
      <Pagination page={Number(filters.page)} totalPages={pagination?.totalPages ?? 1} total={pagination?.total ?? 0} onPage={(p) => change({ page: String(p) })} />

      {open?.kind === "add" && <AddVariantDialog onClose={close} onSaved={saved} />}
      {open?.kind === "adjust" && <AdjustDialog row={open.row} onClose={close} onSaved={saved} />}
      {open?.kind === "edit" && <EditVariantDialog row={open.row} onClose={close} onSaved={saved} />}
      {open?.kind === "history" && <HistoryDialog row={open.row} onClose={close} />}
    </>
  );
}
