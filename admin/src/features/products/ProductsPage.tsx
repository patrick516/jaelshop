import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { api } from "@/lib/api";
import type { Product } from "./types";
import { useLookups } from "./useLookups";
import { useProductFilters } from "./useProductFilters";
import { useProducts } from "./useProducts";
import ProductDialog from "./ProductDialog";
import ProductFilters from "./ProductFilters";
import ProductsTable from "./ProductsTable";

// Only puts the products screen together. Add and edit open as a pop-up over the table
export default function ProductsPage() {
  const { filters, change } = useProductFilters();
  const [params] = useSearchParams();
  const { categories } = useLookups();
  const { items, pagination, error, loading, reload } = useProducts(filters);
  const [dialog, setDialog] = useState<{ id?: string } | null>(() => (params.get("add") ? {} : null)); // {} = add, {id} = edit, null = closed
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // The dashboard shortcut opens this page with ?add=1. Closing the pop-up removes it from the address
  const closeDialog = () => {
    setDialog(null);
    if (params.get("add")) change({});
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${toDelete.id}`);
      toast.success("Product deleted");
      setToDelete(null);
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete this product");
    }
    setDeleting(false);
  };

  return (
    <>
      <PageHeader title="Products" subtitle="Manage everything you sell.">
        <Button onClick={() => setDialog({})} className="bg-orange-500 hover:bg-orange-600">
          <Plus size={18} className="mr-2" /> Add Product
        </Button>
      </PageHeader>

      {/* key remounts the filters when the top bar search changes the address */}
      <ProductFilters key={filters.search} filters={filters} categories={categories} onChange={change} />
      {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p> : <ProductsTable items={items} loading={loading} onEdit={(p) => setDialog({ id: p.id })} onDelete={setToDelete} />}
      <Pagination page={Number(filters.page)} totalPages={pagination?.totalPages ?? 1} total={pagination?.total ?? 0} onPage={(p) => change({ page: String(p) })} />

      {dialog && (
        <ProductDialog
          id={dialog.id}
          onClose={() => {
            closeDialog();
            reload();
          }}
          onSaved={() => {
            closeDialog();
            reload();
          }}
        />
      )}
      <ConfirmDialog
        open={!!toDelete}
        title="Delete this product?"
        description={`"${toDelete?.name}" will be removed for good. If it already has orders, archive it instead (edit it and set the status to Archived).`}
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
