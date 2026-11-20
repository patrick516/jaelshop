import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Product } from "./types";
import ProductRow from "./ProductRow";

type Props = { items: Product[]; loading: boolean; onEdit: (product: Product) => void; onDelete: (product: Product) => void };

// The table with a loading state and an empty state
export default function ProductsTable({ items, loading, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={6}>
                  <Skeleton className="h-12 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            items.map((p) => <ProductRow key={p.id} product={p} onEdit={onEdit} onDelete={onDelete} />)
          )}
        </TableBody>
      </Table>
    </div>
  );
}
