import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/useFetch";
import { formatDateTime } from "@/lib/format";
import { MOVEMENT_LABEL, versionLabel, type Movement, type StockRow } from "./types";

// Every stock change of one version: who, when, how many and why
export default function HistoryDialog({ row, onClose }: { row: StockRow; onClose: () => void }) {
  const { data, error, loading } = useFetch<Movement[]>(`/inventory/variants/${row.variantId}/movements`);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-navy">Stock history</DialogTitle>
          <DialogDescription>
            {row.productName} ({versionLabel(row)}). The latest 50 changes.
          </DialogDescription>
        </DialogHeader>
        {loading && <Skeleton className="h-40 w-full" />}
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p>}
        {data?.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No stock changes yet</p>}
        <div className="divide-y">
          {data?.map((m) => (
            <div key={m.id} className="flex items-start justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-semibold text-navy">{MOVEMENT_LABEL[m.type] ?? m.type}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(m.createdAt)}
                  {m.user ? ` · ${m.user.firstName} ${m.user.lastName}` : ""}
                </p>
                {m.note && <p className="text-xs text-muted-foreground">{m.note}</p>}
              </div>
              <span className={`shrink-0 font-bold ${m.quantity > 0 ? "text-green-600" : "text-destructive"}`}>{m.quantity > 0 ? `+${m.quantity}` : m.quantity}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
