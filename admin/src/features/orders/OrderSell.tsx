import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Field from "@/components/shared/Field";
import OptionSelect from "@/components/shared/OptionSelect";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";
import { formatDate, formatMK } from "@/lib/format";
import { methodLabel } from "@/lib/labels";
import { paidTotal } from "./money";
import { CLOSED, type OrderDetail } from "./types";

// The payment methods for the drop-down, built from the readable names in labels.ts
const METHOD_OPTIONS = Object.entries(methodLabel).map(([value, label]) => ({ value, label }));

const round2 = (n: number) => Math.round(n * 100) / 100; // stops results like 0.30000000000000004

type Props = { order: OrderDetail; onChanged: () => void };

// "Mark as sold": staff types the price agreed with the customer on WhatsApp and what was paid
export default function OrderSell({ order, onChanged }: Props) {
  const current = Number(order.total); // the price now on the order
  const paid = paidTotal(order.payments); // money already received, e.g. earlier installments
  const [agreed, setAgreed] = useState(String(current)); // starts at the listed price
  const [received, setReceived] = useState(""); // empty means the customer paid everything
  const [method, setMethod] = useState(order.payments[0]?.method ?? "CASH_ON_DELIVERY");
  const [reference, setReference] = useState("");
  const { busy, error, run } = useSubmit();

  if (CLOSED.includes(order.status)) return null; // cancelled and refunded orders cannot be sold

  // Already sold: show the deal that was made
  if (order.status === "DELIVERED") {
    if (!order.listTotal) return null; // sold with the plain status drop-down, nothing to compare
    const listed = Number(order.listTotal);
    const change = round2(listed - current); // above 0 = discount, below 0 = extra
    return (
      <div className="space-y-1 rounded-xl border border-green-200 bg-green-50 p-4 text-sm">
        <p className="font-extrabold text-green-700">Sold{order.soldAt ? ` on ${formatDate(order.soldAt)}` : ""}</p>
        <p>Listed price: {formatMK(listed)}</p>
        <p>Agreed price: {formatMK(current)}</p>
        {change !== 0 && (
          <p className={`font-semibold ${change > 0 ? "text-green-700" : "text-navy"}`}>
            {change > 0 ? "Discount given" : "Extra charged"}: {formatMK(Math.abs(change))}
          </p>
        )}
      </div>
    );
  }

  const agreedNum = Number(agreed);
  const validPrice = agreed.trim() !== "" && agreedNum > 0;
  const change = round2(current - agreedNum); // above 0 = the customer pays less
  const owed = round2(agreedNum - paid); // what the customer still has to pay at the agreed price
  const receivedNum = received.trim() === "" ? owed : Number(received); // empty means paid in full
  const left = round2(owed - receivedNum); // stays as the customer's balance
  const needsCustomer = left > 0 && !order.customer; // a balance can only be followed for a linked customer
  const tooMuch = receivedNum > owed || receivedNum < 0; // more than the customer owes

  const submit = async () => {
    const body = {
      agreedTotal: agreedNum,
      amountPaid: received.trim() === "" ? undefined : Number(received), // left out = paid in full
      method,
      transactionRef: reference.trim() || undefined,
    };
    if (await run(() => api.post(`/orders/${order.id}/sell`, body), "Order marked as sold")) onChanged();
  };

  return (
    <div className="space-y-3 rounded-xl border border-orange-200 bg-orange-50/40 p-4 text-sm">
      <p className="font-extrabold text-navy">Mark as sold</p>
      <p className="text-muted-foreground">Type the price you agreed with the customer on WhatsApp. Sales and profit use this price.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Agreed price (MK)" htmlFor="sell-price">
          <Input id="sell-price" type="number" min="0" inputMode="decimal" value={agreed} onChange={(e) => setAgreed(e.target.value)} />
        </Field>
        <Field label="Received now (MK)" htmlFor="sell-received" hint="Leave empty if they paid everything.">
          <Input id="sell-received" type="number" min="0" inputMode="decimal" placeholder={validPrice ? String(Math.max(owed, 0)) : ""} value={received} onChange={(e) => setReceived(e.target.value)} />
        </Field>
        <Field label="Paid by" htmlFor="sell-method">
          <OptionSelect value={method} onChange={setMethod} options={METHOD_OPTIONS} placeholder="Payment method" />
        </Field>
        <Field label="Reference (optional)" htmlFor="sell-ref">
          <Input id="sell-ref" placeholder="e.g. Airtel Money code" value={reference} onChange={(e) => setReference(e.target.value)} />
        </Field>
      </div>

      {/* The comparison the owner asked for: listed price against the agreed price */}
      {validPrice && (
        <div className="space-y-1 rounded-lg bg-white p-3">
          <div className="flex justify-between">
            <span>Listed price</span>
            <span>{formatMK(current)}</span>
          </div>
          <div className="flex justify-between">
            <span>Agreed price</span>
            <span className="font-bold text-navy">{formatMK(agreedNum)}</span>
          </div>
          {change !== 0 && (
            <div className={`flex justify-between font-semibold ${change > 0 ? "text-green-600" : "text-navy"}`}>
              <span>{change > 0 ? "Discount given" : "Extra charged"}</span>
              <span>{formatMK(Math.abs(change))}</span>
            </div>
          )}
          {left > 0 && !tooMuch && (
            <div className="flex justify-between font-semibold text-destructive">
              <span>Stays as balance</span>
              <span>{formatMK(left)}</span>
            </div>
          )}
        </div>
      )}
      {needsCustomer && <p className="rounded-lg bg-amber-50 p-3 font-semibold text-amber-800">Link this order to a customer above to sell on part payment, so the balance can be followed.</p>}
      {tooMuch && <p className="rounded-lg bg-amber-50 p-3 font-semibold text-amber-800">The customer only owes {formatMK(Math.max(owed, 0))}.</p>}
      {error && <p className="rounded-lg bg-red-50 p-3 font-semibold text-destructive">{error}</p>}
      <Button onClick={submit} disabled={busy || !validPrice || needsCustomer || tooMuch} className="w-full bg-orange-500 hover:bg-orange-600">
        {busy ? "Saving..." : "Mark as sold"}
      </Button>
    </div>
  );
}
