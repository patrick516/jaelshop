import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CouponRow from "./CouponRow";
import type { Coupon } from "./types";

type Props = { items: Coupon[]; loading: boolean; onEdit: (c: Coupon) => void; onDelete: (c: Coupon) => void };

// The codes table with a loading state and an empty state
export default function CouponsTable({ items, loading, onEdit, onDelete }: Props) {
  const message = (content: React.ReactNode) => (
    <TableRow>
      <TableCell colSpan={7}>{content}</TableCell>
    </TableRow>
  );

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead className="hidden md:table-cell">Minimum order</TableHead>
            <TableHead>Used</TableHead>
            <TableHead className="hidden lg:table-cell">Valid</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? message(<Skeleton className="h-12 w-full" />)
            : items.length === 0
              ? message(<p className="py-8 text-center text-muted-foreground">No discount codes yet</p>)
              : items.map((c) => <CouponRow key={c.id} coupon={c} onEdit={onEdit} onDelete={onDelete} />)}
        </TableBody>
      </Table>
    </div>
  );
}
