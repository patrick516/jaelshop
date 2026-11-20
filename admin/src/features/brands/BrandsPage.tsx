import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import PageHeader from "@/components/shared/PageHeader";
import { useDeleteDialog } from "@/hooks/useDeleteDialog";
import { useFetch } from "@/hooks/useFetch";
import BrandDialog from "./BrandDialog";
import BrandsTable from "./BrandsTable";
import type { Brand } from "./types";

// Only puts the brands screen together
export default function BrandsPage() {
  const { data, error, loading, reload } = useFetch<Brand[]>("/brands/all");
  const [dialog, setDialog] = useState<{ brand: Brand | null } | null>(null); // null means closed
  const del = useDeleteDialog<Brand>("/brands", reload);

  return (
    <>
      <PageHeader title="Brands" subtitle="The makers of the products you sell.">
        <Button onClick={() => setDialog({ brand: null })} className="bg-orange-500 hover:bg-orange-600">
          <Plus size={18} className="mr-2" /> Add Brand
        </Button>
      </PageHeader>

      {error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p>
      ) : (
        <BrandsTable items={data ?? []} loading={loading} onEdit={(brand) => setDialog({ brand })} onDelete={del.ask} />
      )}

      {dialog && (
        <BrandDialog
          brand={dialog.brand}
          onClose={() => setDialog(null)}
          onSaved={() => {
            setDialog(null);
            reload();
          }}
        />
      )}
      <ConfirmDialog
        open={!!del.target}
        title="Delete this brand?"
        description={`"${del.target?.name}" will be removed. Products that used it keep working, they just show no brand.`}
        confirmLabel="Delete"
        busy={del.busy}
        onConfirm={del.confirm}
        onCancel={del.cancel}
      />
    </>
  );
}
