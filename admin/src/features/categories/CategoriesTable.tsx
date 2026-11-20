import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CategoryRow from "./CategoryRow";
import type { Category } from "./types";

type Props = { items: Category[]; loading: boolean; onEdit: (c: Category) => void; onDelete: (c: Category) => void };

// The table with a loading state and an empty state
export default function CategoriesTable({ items, loading, onEdit, onDelete }: Props) {
  const nameOf = (id: string | null) => items.find((c) => c.id === id)?.name;

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="hidden sm:table-cell">Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Skeleton className="h-12 w-full" />
              </TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                No categories yet
              </TableCell>
            </TableRow>
          ) : (
            items.map((c) => <CategoryRow key={c.id} category={c} parentName={nameOf(c.parentId)} onEdit={onEdit} onDelete={onDelete} />)
          )}
        </TableBody>
      </Table>
    </div>
  );
}
