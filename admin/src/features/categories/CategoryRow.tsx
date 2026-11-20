import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import ActiveBadge from "@/components/shared/ActiveBadge";
import type { Category } from "./types";

type Props = { category: Category; parentName?: string; onEdit: (c: Category) => void; onDelete: (c: Category) => void };

// One row of the categories table
export default function CategoryRow({ category: c, parentName, onEdit, onDelete }: Props) {
  return (
    <TableRow>
      <TableCell>
        <p className="font-semibold text-navy">{c.name}</p>
        {parentName && <p className="text-xs text-muted-foreground">in {parentName}</p>}
      </TableCell>
      <TableCell>{c._count?.products ?? 0}</TableCell>
      <TableCell className="hidden sm:table-cell">{c.sortOrder}</TableCell>
      <TableCell>
        <ActiveBadge active={c.isActive} />
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => onEdit(c)}>
          <Pencil size={16} />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Delete" className="text-destructive" onClick={() => onDelete(c)}>
          <Trash2 size={16} />
        </Button>
      </TableCell>
    </TableRow>
  );
}
