import { Badge } from "@/components/ui/badge";
import type { StaffStatus } from "./types";

const STYLES: Record<StaffStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100",
  INACTIVE: "bg-gray-200 text-gray-700 hover:bg-gray-200",
  SUSPENDED: "bg-red-100 text-red-800 hover:bg-red-100",
};

// A small coloured pill: Active, Inactive or Suspended
export default function StaffStatusBadge({ status }: { status: StaffStatus }) {
  return (
    <Badge variant="secondary" className={STYLES[status]}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
