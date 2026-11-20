import { ArrowUpDown, History, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { versionLabel, type StockRow } from "./types";

type Props = { items: StockRow[]; loading: boolean; onAdjust: (r: StockRow) => void; onHistory: (r: StockRow) => void; onEdit: (r: StockRow) => void };

// Out of stock (red), low (amber) or just the number
function Stock({ row }: { row: StockRow }) {
  if (row.quantity === 0) return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">Out of stock</Badge>;
  if (row.isLowStock) return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Low: {row.quantity}</Badge>;
  return <span className="font-semibold">{row.quantity}</span>;
}

// The inventory table with a loading state and an empty state
export default function InventoryTable({ items, loading, onAdjust, onHistory, onEdit }: Props) {
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
            <TableHead>Product</TableHead>
            <TableHead>Version</TableHead>
            <TableHead className="hidden md:table-cell">SKU</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? message(<Skeleton className="h-12 w-full" />)
            : items.length === 0
              ? message(<p className="py-8 text-center text-muted-foreground">Nothing found</p>)
              : items.map((r) => (
                  <TableRow key={r.variantId}>
                    <TableCell className="font-semibold text-navy">{r.productName}</TableCell>
                    <TableCell>
                      {versionLabel(r)}
                      {!r.isActive && <span className="ml-2 text-xs text-muted-foreground">(hidden)</span>}
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground md:table-cell">{r.sku}</TableCell>
                    <TableCell>
                      <Stock row={r} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" aria-label="Adjust stock" onClick={() => onAdjust(r)}>
                        <ArrowUpDown size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Stock history" onClick={() => onHistory(r)}>
                        <History size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Edit version" onClick={() => onEdit(r)}>
                        <Pencil size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
        </TableBody>
      </Table>
    </div>
  );
}
