export const formatMK = (value: number | string): string =>
  `MK ${Number(value).toLocaleString("en-US")}`;
