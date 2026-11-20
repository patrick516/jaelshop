import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Pagination from "@/components/shared/Pagination";
import SearchBox from "@/components/shared/SearchBox";
import { useDeleteDialog } from "@/hooks/useDeleteDialog";
import { usePagedList } from "@/hooks/usePagedList";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import StaffDialog from "./StaffDialog";
import StaffTable from "./StaffTable";
import type { Role, StaffMember } from "./types";

// The staff list with search, add, edit and delete
export default function StaffTab({ roles }: { roles: Role[] }) {
  const { filters, change } = useUrlFilters(["search", "page"]);
  const { items, pagination, error, loading, reload } = usePagedList<StaffMember>("/staff", filters, 10);
  const [dialog, setDialog] = useState<{ member: StaffMember | null } | null>(null); // null means closed
  const del = useDeleteDialog<StaffMember>("/staff", reload);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-3">
        <SearchBox key={filters.search} initial={filters.search} placeholder="Search by name or email..." onSearch={(search) => change({ search })} />
        <Button onClick={() => setDialog({ member: null })} className="bg-orange-500 hover:bg-orange-600">
          <Plus size={18} className="mr-2" /> Add Staff
        </Button>
      </div>

      {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p> : <StaffTable items={items} loading={loading} onEdit={(member) => setDialog({ member })} onDelete={del.ask} />}
      <Pagination page={Number(filters.page)} totalPages={pagination?.totalPages ?? 1} total={pagination?.total ?? 0} onPage={(p) => change({ page: String(p) })} />

      {dialog && (
        <StaffDialog
          member={dialog.member}
          roles={roles}
          onClose={() => setDialog(null)}
          onSaved={() => {
            setDialog(null);
            reload();
          }}
        />
      )}
      <ConfirmDialog
        open={!!del.target}
        title="Delete this staff member?"
        description={`${del.target?.firstName} ${del.target?.lastName} will be removed. To keep their history, set them to Inactive instead. You cannot delete your own account.`}
        confirmLabel="Delete"
        busy={del.busy}
        onConfirm={del.confirm}
        onCancel={del.cancel}
      />
    </div>
  );
}
