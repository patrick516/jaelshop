import { formatDate } from "@/lib/format";

// "1 Nov 2026 to 30 Nov 2026"
export const periodText = (from: string, to: string): string => `${formatDate(from)} to ${formatDate(to)}`;

// A table row's date: "20 Nov 2026" for a day, "November 2026" for a month
export const periodLabel = (iso: string, monthly: boolean): string =>
  new Date(iso).toLocaleDateString("en-GB", monthly ? { month: "long", year: "numeric" } : { day: "numeric", month: "short", year: "numeric" });

export const total = (list: number[]): number => list.reduce((a, b) => a + b, 0);
export const capital = (word: string): string => word.charAt(0) + word.slice(1).toLowerCase();
