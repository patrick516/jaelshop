import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import StaffStatusBadge from "./StaffStatusBadge";
import type { StaffMember } from "./types";

type Props = { items: StaffMember[]; loading: boolean; onEdit: (m: StaffMember) => void; onDelete: (m: StaffMember) => void };

// The staff table with a loading state and an empty state
export default function StaffTable({ items, loading, onEdit, onDelete }: Props) {
  const message = (content: React.ReactNode) => (
    <TableRow>
      <TableCell colSpan={5}>{content}</TableCell>
    </TableRow>
  );

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Last login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? message(<Skeleton className="h-12 w-full" />)
            : items.length === 0
              ? message(<p className="py-8 text-center text-muted-foreground">No staff found</p>)
              : items.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <p className="font-semibold text-navy">
                        {m.firstName} {m.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </TableCell>
                    <TableCell>{m.role.name}</TableCell>
                    <TableCell>
                      <StaffStatusBadge status={m.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{m.lastLoginAt ? formatDateTime(m.lastLoginAt) : "Never"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => onEdit(m)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Delete" className="text-destructive" onClick={() => onDelete(m)}>
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
        </TableBody>
      </Table>
    </div>
  );
}
