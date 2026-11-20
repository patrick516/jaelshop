import { Badge } from "@/components/ui/badge";

const STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  PAID: "bg-green-100 text-green-800 hover:bg-green-100",
  FAILED: "bg-red-100 text-red-800 hover:bg-red-100",
  REFUNDED: "bg-gray-200 text-gray-700 hover:bg-gray-200",
};

// A small coloured pill: Pending, Paid, Failed or Refunded
export default function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="secondary" className={STYLES[status] ?? STYLES.REFUNDED}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
