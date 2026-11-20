export const formatMK = (value: number | string): string =>
  `MK ${Number(value).toLocaleString("en-US")}`;

// A date as text, e.g. "17 Nov 2026"
export const formatDate = (iso: string): string => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
