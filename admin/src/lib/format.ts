// Money as text, e.g. 15500 becomes "MK 15,500". Accepts numbers or the text the API sends
export const formatMK = (value: number | string): string => `MK ${Number(value).toLocaleString("en-US")}`;

// A date as text, e.g. "17 Nov 2026"
export const formatDate = (iso: string): string => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// Date and time as text, e.g. "17 Nov 2026, 14:05"
export const formatDateTime = (iso: string): string => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
