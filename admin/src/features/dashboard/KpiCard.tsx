import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "navy" | "orange" | "white";
const TONES: Record<Tone, string> = { navy: "bg-navy text-white", orange: "bg-orange-500 text-white", white: "border bg-white text-navy" };

type Props = { label: string; value: string; change?: number; Icon: LucideIcon; tone: Tone };

// One number card. change is the % compared with the period before (left out when not meaningful)
export default function KpiCard({ label, value, change, Icon, tone }: Props) {
  const up = (change ?? 0) >= 0;
  const changeColor = tone === "white" ? (up ? "text-green-600" : "text-red-600") : tone === "navy" ? (up ? "text-green-300" : "text-red-300") : "text-white";

  return (
    <div className={cn("flex items-center gap-4 rounded-2xl p-5 shadow-sm", TONES[tone])}>
      <Icon size={40} className={tone === "white" ? "text-orange-500" : "text-white"} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-2xl font-extrabold">{value}</p>
        <p className="text-sm opacity-90">{label}</p>
      </div>
      {change !== undefined && (
        <span className={cn("flex items-center text-sm font-bold", changeColor)}>
          {up ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          {Math.abs(change)}%
        </span>
      )}
    </div>
  );
}
