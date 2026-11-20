import type { ReportDoc } from "./types";

// Saves a file in the browser, as if it had been downloaded
export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// e.g. "JAEL Profit report 1 Nov 2026 to 30 Nov 2026.xlsx"
export const fileName = (doc: ReportDoc, extension: string): string => `JAEL ${doc.title} ${doc.period}.${extension}`.replace(/[\\/:*?"<>|]/g, "-");
