import { formatMK } from "@/lib/format";
import type { ReportDoc } from "@/lib/export/types";
import { periodLabel, periodText } from "./docHelpers";
import type { ProfitData } from "./types";

export function profitDoc(d: ProfitData, from: string, to: string, monthly: boolean): ReportDoc {
  const t = d.totals;
  const partial = d.byProduct.some((r) => r.margin !== null && r.uncostedRevenue > 0);
  const notes = [
    "Gross profit is sales after discounts minus the cost of the items sold. Delivery, rent, transport and salaries are not included.",
    "Cost prices are saved when an order is placed, so a later change to a cost price does not change past profit.",
  ];
  if (t.uncostedRevenue > 0) notes.push(`${formatMK(t.uncostedRevenue)} of sales had no cost price and are not counted in the profit.`);
  if (partial) notes.push("* Some sales of this product had no cost price, so its profit counts only the items that did.");

  return {
    title: "Profit report",
    period: periodText(from, to),
    filters: [`Grouped by ${monthly ? "month" : "day"}`],
    highlights: [
      { label: "Sales (after discounts)", value: formatMK(t.revenue) },
      { label: "Cost of goods", value: formatMK(t.cost) },
      { label: "Gross profit", value: formatMK(t.profit), tone: t.profit >= 0 ? "good" : "bad" },
      { label: "Profit margin", value: t.margin === null ? "-" : `${t.margin}%` },
      { label: "Discounts given", value: formatMK(d.discounts) },
    ],
    sections: [
      {
        title: "Profit by product",
        columns: [
          { header: "Product", type: "text", width: 36 },
          { header: "Units", type: "number" },
          { header: "Sales", type: "money" },
          { header: "Cost", type: "money" },
          { header: "Profit", type: "money" },
          { header: "Margin", type: "percent" },
        ],
        rows: d.byProduct.map((r) => [
          r.name + (r.margin !== null && r.uncostedRevenue > 0 ? " *" : ""),
          r.quantity,
          r.revenue,
          r.margin === null ? null : r.cost,
          r.margin === null ? null : r.profit,
          r.margin,
        ]),
        total: ["All products", t.quantity, t.revenue, t.cost, t.margin === null ? null : t.profit, t.margin],
      },
      {
        title: monthly ? "Profit by month" : "Profit by day",
        columns: [
          { header: monthly ? "Month" : "Date", type: "text" },
          { header: "Sales", type: "money" },
          { header: "Cost", type: "money" },
          { header: "Profit", type: "money" },
          { header: "Margin", type: "percent" },
        ],
        rows: d.byPeriod.map((r) => [periodLabel(r.period, monthly), r.revenue, r.margin === null ? null : r.cost, r.margin === null ? null : r.profit, r.margin]),
      },
    ],
    notes,
  };
}
