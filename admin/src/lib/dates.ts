// A date as YYYY-MM-DD in the visitor's own time zone, which is what the date inputs and the reports use
const iso = (d: Date): string => d.toLocaleDateString("en-CA");

export const today = (): string => iso(new Date());
export const daysAgo = (n: number): string => iso(new Date(Date.now() - n * 24 * 60 * 60 * 1000));

// Whole days between two YYYY-MM-DD dates
export const daysBetween = (from: string, to: string): number => Math.round((new Date(to).getTime() - new Date(from).getTime()) / (24 * 60 * 60 * 1000));
