import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMK } from "@/lib/format";
import { fullName, type CustomerRow } from "./types";

type Props = { items: CustomerRow[]; loading: boolean; onOpen: (id: string) => void };

// What a customer owes: red when they owe, "Cleared" when they have paid everything, a dash when no orders
function Balance({ c }: { c: CustomerRow }) {
  if (c.balance > 0) return <span className="font-bold text-destructive">{formatMK(c.balance)}</span>;
  return c.orderCount > 0 ? <span className="text-xs font-semibold text-green-600">Cleared</span> : <span className="text-muted-foreground">-</span>;
}

// The customers table. Clicking a row opens the customer
export default function CustomersTable({ items, loading, onOpen }: Props) {
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
            <TableHead>Customer</TableHead>
            <TableHead className="hidden sm:table-cell">Orders</TableHead>
            <TableHead className="hidden md:table-cell">Bought</TableHead>
            <TableHead className="text-right">Owes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? message(<Skeleton className="h-12 w-full" />)
            : items.length === 0
              ? message(<p className="py-8 text-center text-muted-foreground">No customers yet. Add one when someone buys on loan.</p>)
              : items.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => onOpen(c.id)}>
                    <TableCell>
                      <p className="font-semibold text-navy">{fullName(c)}</p>
                      <p className="text-xs text-muted-foreground">{c.phone ?? c.email ?? "No contact"}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{c.orderCount}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatMK(c.ordered)}</TableCell>
                    <TableCell className="text-right">
                      <Balance c={c} />
                    </TableCell>
                  </TableRow>
                ))}
        </TableBody>
      </Table>
    </div>
  );
}
