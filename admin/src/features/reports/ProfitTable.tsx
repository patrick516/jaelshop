import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMK } from "@/lib/format";
import type { ProfitData } from "./types";

// Profit of each product, best first. A star marks a product with some sales that had no cost price
export default function ProfitTable({ rows }: { rows: ProfitData["byProduct"] }) {
  const partial = rows.some((r) => r.margin !== null && r.uncostedRevenue > 0);

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Units</TableHead>
              <TableHead className="hidden sm:table-cell">Sales</TableHead>
              <TableHead className="hidden sm:table-cell">Cost</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead className="text-right">Margin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No sales in this period
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => {
                const known = r.margin !== null;
                const tone = !known ? "text-muted-foreground" : r.profit < 0 ? "text-destructive" : "text-green-600";
                return (
                  <TableRow key={r.name}>
                    <TableCell className="font-semibold text-navy">
                      {r.name}
                      {known && r.uncostedRevenue > 0 ? " *" : ""}
                    </TableCell>
                    <TableCell>{r.quantity}</TableCell>
                    <TableCell className="hidden sm:table-cell">{formatMK(r.revenue)}</TableCell>
                    <TableCell className="hidden sm:table-cell">{known ? formatMK(r.cost) : "-"}</TableCell>
                    <TableCell className={`font-bold ${tone}`}>{known ? formatMK(r.profit) : "No cost price"}</TableCell>
                    <TableCell className="text-right">{known ? `${r.margin}%` : "-"}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {partial && <p className="text-xs text-muted-foreground">* Some sales of this product had no cost price, so its profit counts only the items that did.</p>}
    </div>
  );
}
