import { Pencil, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatMK } from "@/lib/format";
import { totalStock, type Product } from "./types";
import ProductStatusBadge from "./ProductStatusBadge";
import ProductThumb from "./ProductThumb";

type Props = { product: Product; onEdit: (product: Product) => void; onDelete: (product: Product) => void };

// One row of the products table
export default function ProductRow({ product: p, onEdit, onDelete }: Props) {
  const stock = totalStock(p);
  const image = p.images.find((i) => i.isPrimary) ?? p.images[0];

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <ProductThumb url={image?.url} alt={p.name} />
          <div className="min-w-0">
            <p className="flex items-center gap-1 font-semibold text-navy">
              <span className="truncate">{p.name}</span>
              {p.isFeatured && <Star size={14} className="shrink-0 fill-orange-500 text-orange-500" aria-label="Featured" />}
            </p>
            {p.brand && <p className="text-xs text-muted-foreground">{p.brand.name}</p>}
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">{p.category.name}</TableCell>
      <TableCell className="font-semibold">{formatMK(p.price)}</TableCell>
      <TableCell className={stock === 0 ? "font-semibold text-destructive" : stock <= 5 ? "font-semibold text-amber-600" : ""}>{stock === 0 ? "Out of stock" : stock}</TableCell>
      <TableCell>
        <ProductStatusBadge status={p.status} />
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => onEdit(p)}>
          <Pencil size={16} />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Delete" className="text-destructive" onClick={() => onDelete(p)}>
          <Trash2 size={16} />
        </Button>
      </TableCell>
    </TableRow>
  );
}
