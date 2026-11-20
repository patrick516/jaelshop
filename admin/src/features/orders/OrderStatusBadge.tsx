import { Badge } from "@/components/ui/badge";

const STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  CONFIRMED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  PROCESSING: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  SHIPPED: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  DELIVERED: "bg-green-100 text-green-800 hover:bg-green-100",
  CANCELLED: "bg-red-100 text-red-800 hover:bg-red-100",
  REFUNDED: "bg-gray-200 text-gray-700 hover:bg-gray-200",
};

// A small coloured pill, e.g. "Delivered". Unknown statuses fall back to grey
export default function OrderStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="secondary" className={STYLES[status] ?? STYLES.REFUNDED}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
