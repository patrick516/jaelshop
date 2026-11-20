import { formatMK } from "@/lib/format";
import type { Cell, ColumnType } from "./types";

// How a cell reads in the PDF
export function cellText(value: Cell, type: ColumnType): string {
  if (value === null || value === "") return "-";
  if (typeof value === "string") return value;
  if (type === "money") return formatMK(value);
  if (type === "percent") return `${value}%`;
  return value.toLocaleString("en-US");
}

export const isNumeric = (type: ColumnType): boolean => type !== "text";

// The date and time the file was made, e.g. "20 Nov 2026, 14:05"
export const stamp = (): string => new Date().toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
