// A date as YYYY-MM-DD in the visitor's own time zone, which is what the date inputs and the reports use
const iso = (d: Date): string => d.toLocaleDateString("en-CA");

export const today = (): string => iso(new Date());
export const daysAgo = (n: number): string => iso(new Date(Date.now() - n * 24 * 60 * 60 * 1000));

// Whole days between two YYYY-MM-DD dates
export const daysBetween = (from: string, to: string): number => Math.round((new Date(to).getTime() - new Date(from).getTime()) / (24 * 60 * 60 * 1000));

// The full date for a chart tooltip: "Sat, 17 Nov 2026" for a day, "November 2026" for a month
export const tipDate = (iso: string, monthly: boolean): string =>
  new Date(iso).toLocaleDateString("en-GB", monthly ? { month: "long", year: "numeric" } : { weekday: "short", day: "numeric", month: "short", year: "numeric" });
