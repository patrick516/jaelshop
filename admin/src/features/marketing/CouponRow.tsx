import { Copy, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatMK } from "@/lib/format";
import CouponStatusBadge from "./CouponStatusBadge";
import { couponState, describeDiscount, validity, type Coupon } from "./types";

type Props = { coupon: Coupon; onEdit: (c: Coupon) => void; onDelete: (c: Coupon) => void };

// One row of the codes table. Tapping the code copies it, ready to send to a customer
export default function CouponRow({ coupon: c, onEdit, onDelete }: Props) {
  const copy = () => navigator.clipboard.writeText(c.code).then(() => toast.success(`${c.code} copied`), () => toast.error("Could not copy"));

  return (
    <TableRow>
      <TableCell>
        <button onClick={copy} aria-label={`Copy ${c.code}`} className="flex items-center gap-2 font-mono font-bold text-navy">
          {c.code} <Copy size={14} className="text-muted-foreground" />
        </button>
      </TableCell>
      <TableCell className="font-semibold">{describeDiscount(c)}</TableCell>
      <TableCell className="hidden md:table-cell">{c.minOrderAmount ? formatMK(c.minOrderAmount) : "-"}</TableCell>
      <TableCell>
        {c.usedCount} / {c.maxUses ?? "unlimited"}
      </TableCell>
      <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">{validity(c)}</TableCell>
      <TableCell>
        <CouponStatusBadge state={couponState(c)} />
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
