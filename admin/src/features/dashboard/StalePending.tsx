import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMK } from "@/lib/format";
import { sourceLabel } from "@/lib/labels";
import OrderDialog from "@/features/orders/OrderDialog";
import type { DashboardData } from "./types";

// 5 hours stays "5h", 3 days of waiting shows "3 days"
const waited = (hours: number) => (hours < 48 ? `${hours}h` : `${Math.floor(hours / 24)} days`);

type Props = { data: DashboardData; onChanged: () => void };

// Pending orders that have waited longer than the limit set in Settings.
// These are customers who tapped "Order via WhatsApp" but have not bought yet
export default function StalePending({ data, onChanged }: Props) {
  const [openId, setOpenId] = useState<string | null>(null); // the order shown in the pop-up
  if (data.staleCount === 0) return null; // nothing is overdue, so no banner

  return (
    <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="flex items-center gap-2 text-sm font-extrabold text-amber-800">
        <Clock size={18} /> {data.staleCount} {data.staleCount === 1 ? "order has" : "orders have"} been waiting more than {data.staleHours} hours
      </p>
      <p className="text-xs text-amber-800/80">These customers tapped Order via WhatsApp but have not bought yet. Open one to mark it sold at the agreed price, or cancel it to put the stock back.</p>
      <div className="divide-y rounded-lg bg-white">
        {data.stalePending.map((o) => (
          <div key={o.id} className="flex items-center justify-between gap-3 p-3 text-sm">
            <div>
              <p className="font-semibold text-navy">
                {o.customer} <span className="text-xs font-normal text-muted-foreground">{o.orderNumber}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {o.phone} · {o.items} {o.items === 1 ? "item" : "items"} · {formatMK(o.total)} · {sourceLabel[o.source] ?? o.source}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs font-bold text-amber-700">{waited(o.hoursPending)}</span>
              <Button size="sm" variant="outline" onClick={() => setOpenId(o.id)}>
                Open
              </Button>
            </div>
          </div>
        ))}
      </div>
      {data.staleCount > data.stalePending.length && <p className="text-xs text-amber-800/80">Showing the oldest {data.stalePending.length} of {data.staleCount}.</p>}
      {openId && <OrderDialog id={openId} onClose={() => setOpenId(null)} onChanged={onChanged} />}
    </div>
  );
}
