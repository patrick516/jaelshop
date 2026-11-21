import { formatMK } from "@/lib/format";

const Box = ({ label, value, tone }: { label: string; value: string; tone?: string }) => (
  <div className="rounded-lg bg-secondary p-2">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`font-bold ${tone ?? "text-navy"}`}>{value}</p>
  </div>
);

type Props = { total: string | number; paid: number; balance: number };

// Total, paid and balance as three small boxes
export default function PaymentTotals({ total, paid, balance }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      <Box label="Total" value={formatMK(total)} />
      <Box label="Paid" value={formatMK(paid)} tone="text-green-600" />
      <Box label="Balance" value={formatMK(balance)} tone={balance > 0 ? "text-destructive" : "text-green-600"} />
    </div>
  );
}
