import StatCard from "@/components/shared/StatCard";
import { formatMK } from "@/lib/format";
import type { Summary } from "./types";

// The three numbers on top of the Customers page
export default function CustomerSummary({ data }: { data: Summary | null }) {
  return (
    <div className="mb-4 grid gap-4 sm:grid-cols-3">
      <StatCard label="Customers" value={data ? String(data.customerCount) : "-"} />
      <StatCard label="Customers who owe you" value={data ? String(data.owingCount) : "-"} />
      <StatCard label="Total owed to you" value={data ? formatMK(data.totalOwed) : "-"} hint="Unpaid balances on loan orders." />
    </div>
  );
}
