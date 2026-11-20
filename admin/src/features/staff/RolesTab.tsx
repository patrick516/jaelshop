import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useDeleteDialog } from "@/hooks/useDeleteDialog";
import RoleDialog from "./RoleDialog";
import RolesTable from "./RolesTable";
import type { Role } from "./types";

type Props = { roles: Role[]; loading: boolean; onChanged: () => void };

// The roles list with add, edit and delete
export default function RolesTab({ roles, loading, onChanged }: Props) {
  const [dialog, setDialog] = useState<{ role: Role | null } | null>(null); // null means closed
  const del = useDeleteDialog<Role>("/staff/roles", onChanged);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-muted-foreground">
          Roles are saved with the areas you tick. For now the system itself only enforces the Administrator role (staff pages and Settings). Other roles can use the rest of the admin.
        </p>
        <Button onClick={() => setDialog({ role: null })} className="bg-orange-500 hover:bg-orange-600">
          <Plus size={18} className="mr-2" /> Add Role
        </Button>
      </div>

      <RolesTable roles={roles} loading={loading} onEdit={(role) => setDialog({ role })} onDelete={del.ask} />

      {dialog && (
        <RoleDialog
          role={dialog.role}
          onClose={() => setDialog(null)}
          onSaved={() => {
            setDialog(null);
            onChanged();
          }}
        />
      )}
      <ConfirmDialog
        open={!!del.target}
        title="Delete this role?"
        description={`"${del.target?.name}" will be removed. A role that still has staff cannot be deleted. Move them to another role first.`}
        confirmLabel="Delete"
        busy={del.busy}
        onConfirm={del.confirm}
        onCancel={del.cancel}
      />
    </div>
  );
}
