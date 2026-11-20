import { formatMK } from "@/lib/format";

// Under the price boxes: what you earn on each item. price and cost are the text typed in the form
export default function ProfitHint({ price, cost }: { price: string; cost: string }) {
  const sell = Number(price);
  if (!(sell > 0)) return null;
  if (cost.trim() === "") {
    return <p className="rounded-lg bg-secondary p-3 text-sm text-muted-foreground">Enter a cost price to see your profit on each item.</p>;
  }

  const profit = sell - Number(cost);
  const margin = Math.round((profit / sell) * 1000) / 10;
  const good = profit >= 0;

  return (
    <p className={`rounded-lg p-3 text-sm font-semibold ${good ? "bg-green-50 text-green-700" : "bg-red-50 text-destructive"}`}>
      {good ? "Profit per item" : "Loss per item"}: {formatMK(Math.abs(profit))} ({margin}% margin)
    </p>
  );
}
