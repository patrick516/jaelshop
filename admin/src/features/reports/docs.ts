import { formatDate, formatMK } from "@/lib/format";
import { methodLabel } from "@/lib/labels";
import type { ReportDoc } from "@/lib/export/types";
import { capital, periodLabel, periodText, total } from "./docHelpers";
import type { PaymentsData, SalesData, StockData, TopProductsData } from "./types";

export function salesDoc(d: SalesData, from: string, to: string, monthly: boolean): ReportDoc {
  const average = d.totalOrders ? d.totalSales / d.totalOrders : 0;
  return {
    title: "Sales report",
    period: periodText(from, to),
    filters: [`Grouped by ${monthly ? "month" : "day"}`],
    highlights: [
      { label: "Total sales", value: formatMK(d.totalSales) },
      { label: "Orders", value: d.totalOrders.toLocaleString("en-US") },
      { label: "Average order", value: formatMK(Math.round(average)) },
    ],
    sections: [
      {
        title: monthly ? "Sales by month" : "Sales by day",
        columns: [{ header: monthly ? "Month" : "Date", type: "text" }, { header: "Orders", type: "number" }, { header: "Sales", type: "money" }],
        rows: d.rows.map((r) => [periodLabel(r.period, monthly), r.orders, r.sales]),
        total: ["Total", d.totalOrders, d.totalSales],
      },
    ],
    notes: ["Sales are order totals after discounts. Cancelled and refunded orders are not counted."],
  };
}

export function topProductsDoc(d: TopProductsData, from: string, to: string): ReportDoc {
  const units = total(d.rows.map((r) => r.quantity));
  const revenue = total(d.rows.map((r) => r.revenue));
  return {
    title: "Best sellers",
    period: periodText(from, to),
    filters: ["Top 10 products by units sold"],
    highlights: [
      { label: "Units sold (top 10)", value: units.toLocaleString("en-US") },
      { label: "Revenue (top 10)", value: formatMK(revenue) },
    ],
    sections: [
      {
        title: "Top 10 products",
        columns: [{ header: "#", type: "text", width: 6 }, { header: "Product", type: "text", width: 40 }, { header: "Units sold", type: "number" }, { header: "Revenue", type: "money" }],
        rows: d.rows.map((r, i) => [String(i + 1), r.name, r.quantity, r.revenue]),
        total: ["", "Total", units, revenue],
      },
    ],
    notes: ["Revenue is the item totals before any discount code. Cancelled and refunded orders are not counted."],
  };
}

export function paymentsDoc(d: PaymentsData, from: string, to: string): ReportDoc {
  const sumOf = (status: string) => total(d.rows.filter((r) => r.status === status).map((r) => r.amount));
  return {
    title: "Payments report",
    period: periodText(from, to),
    filters: ["All payment methods and statuses"],
    highlights: [
      { label: "Received (paid)", value: formatMK(sumOf("PAID")), tone: "good" },
      { label: "Still waiting (pending)", value: formatMK(sumOf("PENDING")) },
    ],
    sections: [
      {
        title: "Payments by method and status",
        columns: [{ header: "Method", type: "text" }, { header: "Status", type: "text" }, { header: "Payments", type: "number" }, { header: "Amount", type: "money" }],
        rows: d.rows.map((r) => [methodLabel[r.method] ?? r.method, capital(r.status), r.count, r.amount]),
        total: ["All payments", "", total(d.rows.map((r) => r.count)), total(d.rows.map((r) => r.amount))],
      },
    ],
    notes: ["Payments are recorded by staff when the money arrives outside the website."],
  };
}

export function stockDoc(d: StockData): ReportDoc {
  return {
    title: "Stock value report",
    period: `As of ${formatDate(new Date().toISOString())}`,
    filters: ["Every active product"],
    highlights: [
      { label: "Units in stock", value: d.units.toLocaleString("en-US") },
      { label: "Worth at selling price", value: formatMK(d.retailValue) },
      { label: "Worth at cost price", value: formatMK(d.costValue) },
      { label: "Low stock items", value: String(d.lowStockVariants), tone: d.lowStockVariants > 0 ? "bad" : "good" },
    ],
    sections: [],
    notes: ["The cost value only counts products where a cost price was entered. Stock value is always as of today."],
  };
}
