import { Badge } from "@/components/ui/badge";
import type { ProductStatus } from "./types";

const STYLES: Record<ProductStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100",
  DRAFT: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  ARCHIVED: "bg-gray-200 text-gray-700 hover:bg-gray-200",
};

// A small coloured pill: Active, Draft or Archived
export default function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge variant="secondary" className={STYLES[status]}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
