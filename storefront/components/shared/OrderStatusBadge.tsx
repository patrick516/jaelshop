// Colours for each order status. Matches the OrderStatus enum in the backend
const STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-200 text-gray-700",
};

// A small coloured pill, e.g. "Delivered". Unknown statuses fall back to grey
export default function OrderStatusBadge({ status }: { status: string }) {
  const text = status.charAt(0) + status.slice(1).toLowerCase(); // "DELIVERED" becomes "Delivered"
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${STYLES[status] ?? "bg-gray-200 text-gray-700"}`}>{text}</span>;
}
