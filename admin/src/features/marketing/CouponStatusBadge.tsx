import { Badge } from "@/components/ui/badge";
import type { CouponState } from "./types";

const STYLES: Record<CouponState, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  expired: { label: "Expired", className: "bg-gray-200 text-gray-700 hover:bg-gray-200" },
  "used-up": { label: "Fully used", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
  off: { label: "Switched off", className: "bg-gray-200 text-gray-700 hover:bg-gray-200" },
};

// A small coloured pill showing what a code is doing right now
export default function CouponStatusBadge({ state }: { state: CouponState }) {
  const s = STYLES[state];
  return (
    <Badge variant="secondary" className={s.className}>
      {s.label}
    </Badge>
  );
}
