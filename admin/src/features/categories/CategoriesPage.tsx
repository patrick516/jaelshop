import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import PageHeader from "@/components/shared/PageHeader";
import { useDeleteDialog } from "@/hooks/useDeleteDialog";
import { useFetch } from "@/hooks/useFetch";
import CategoriesTable from "./CategoriesTable";
import CategoryDialog from "./CategoryDialog";
import type { Category } from "./types";

// Only puts the categories screen together
export default function CategoriesPage() {
  const { data, error, loading, reload } = useFetch<Category[]>("/categories/all");
  const [dialog, setDialog] = useState<{ category: Category | null } | null>(null); // null means closed
  const del = useDeleteDialog<Category>("/categories", reload);
  const items = data ?? [];

  return (
    <>
      <PageHeader title="Categories" subtitle="Group your products so shoppers can find them.">
        <Button onClick={() => setDialog({ category: null })} className="bg-orange-500 hover:bg-orange-600">
          <Plus size={18} className="mr-2" /> Add Category
        </Button>
      </PageHeader>

      {error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p>
      ) : (
        <CategoriesTable items={items} loading={loading} onEdit={(category) => setDialog({ category })} onDelete={del.ask} />
      )}

      {dialog && (
        <CategoryDialog
          category={dialog.category}
          all={items}
          onClose={() => setDialog(null)}
          onSaved={() => {
            setDialog(null);
            reload();
          }}
        />
      )}
      <ConfirmDialog
        open={!!del.target}
        title="Delete this category?"
        description={`"${del.target?.name}" will be removed. A category that still has products cannot be deleted. Switch it off (Show in the shop) instead.`}
        confirmLabel="Delete"
        busy={del.busy}
        onConfirm={del.confirm}
        onCancel={del.cancel}
      />
    </>
  );
}
