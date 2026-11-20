import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ActiveBadge from "@/components/shared/ActiveBadge";
import type { Brand } from "./types";

type Props = { items: Brand[]; loading: boolean; onEdit: (b: Brand) => void; onDelete: (b: Brand) => void };

// The brands table with a loading state and an empty state
export default function BrandsTable({ items, loading, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3}>
                <Skeleton className="h-12 w-full" />
              </TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                No brands yet
              </TableCell>
            </TableRow>
          ) : (
            items.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-semibold text-navy">{b.name}</TableCell>
                <TableCell>
                  <ActiveBadge active={b.isActive} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => onEdit(b)}>
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Delete" className="text-destructive" onClick={() => onDelete(b)}>
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
