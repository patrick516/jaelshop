import { RANGES } from "./types";
import { cn } from "@/lib/utils";

// The 7D / 30D / 90D / 1Y buttons. The whole dashboard follows the chosen period
export default function RangeTabs({ days, onChange }: { days: number; onChange: (days: number) => void }) {
  return (
    <div className="flex gap-1 rounded-lg border bg-white p-1">
      {RANGES.map((r) => (
        <button key={r.days} onClick={() => onChange(r.days)} className={cn("min-h-9 rounded-md px-4 text-sm font-semibold", days === r.days ? "bg-orange-500 text-white" : "text-navy hover:bg-secondary")}>
          {r.label}
        </button>
      ))}
    </div>
  );
}
