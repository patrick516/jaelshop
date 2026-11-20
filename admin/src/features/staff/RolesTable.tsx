import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isProtected, type Role } from "./types";

type Props = { roles: Role[]; loading: boolean; onEdit: (r: Role) => void; onDelete: (r: Role) => void };

// The roles table. The Administrator role is shown but cannot be changed
export default function RolesTable({ roles, loading, onEdit, onDelete }: Props) {
  const message = (content: React.ReactNode) => (
    <TableRow>
      <TableCell colSpan={4}>{content}</TableCell>
    </TableRow>
  );

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Staff</TableHead>
            <TableHead className="hidden sm:table-cell">Can use</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? message(<Skeleton className="h-12 w-full" />)
            : roles.length === 0
              ? message(<p className="py-8 text-center text-muted-foreground">No roles yet</p>)
              : roles.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <p className="font-semibold text-navy">{r.name}</p>
                      {r.description && <p className="text-xs text-muted-foreground">{r.description}</p>}
                    </TableCell>
                    <TableCell>{r._count.users}</TableCell>
                    <TableCell className="hidden sm:table-cell">{r.permissions.includes("*") ? "Everything" : `${r.permissions.length} areas`}</TableCell>
                    <TableCell className="text-right">
                      {isProtected(r) ? (
                        <span className="text-xs text-muted-foreground">Protected</span>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => onEdit(r)}>
                            <Pencil size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" aria-label="Delete" className="text-destructive" onClick={() => onDelete(r)}>
                            <Trash2 size={16} />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
        </TableBody>
      </Table>
    </div>
  );
}
