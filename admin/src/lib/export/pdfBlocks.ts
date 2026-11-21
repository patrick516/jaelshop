import type { jsPDF } from "jspdf";
import { PAGE } from "./pdfBrand";
import { BORDER, GREEN, GREY_TEXT, LIGHT, NAVY, ORANGE, RED } from "./theme";
import type { Highlight } from "./types";

const usable = PAGE.width - PAGE.margin * 2; // the width between the margins

// The big numbers as small cards: up to 4 in a row, or 3 in a row when there are 5 or more
export function drawHighlights(
  pdf: jsPDF,
  items: Highlight[],
  y: number,
): number {
  if (items.length === 0) return y;
  const perRow = items.length > 4 ? 3 : items.length;
  const gap = 4;
  const w = (usable - gap * (perRow - 1)) / perRow;
  const h = 21;

  items.forEach((item, i) => {
    const x = PAGE.margin + (i % perRow) * (w + gap);
    const top = y + Math.floor(i / perRow) * (h + gap);
    pdf.setFillColor(...LIGHT);
    pdf.setDrawColor(...BORDER);
    pdf.roundedRect(x, top, w, h, 2.5, 2.5, "FD");
    pdf.setFillColor(...ORANGE);
    pdf.rect(x, top + 3, 1.2, h - 6, "F"); // small orange accent
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(...GREY_TEXT);
    pdf.text(item.label, x + 5, top + 7.5);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    const [r, g, b] =
      item.tone === "good" ? GREEN : item.tone === "bad" ? RED : NAVY;
    pdf.setTextColor(r, g, b);
    pdf.text(item.value, x + 5, top + 16);
  });
  return y + Math.ceil(items.length / perRow) * (h + gap) + 4;
}

// The small print under the tables
export function drawNotes(pdf: jsPDF, notes: string[], y: number) {
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(8.5);
  pdf.setTextColor(...GREY_TEXT);
  let top = y;
  for (const note of notes) {
    const lines = pdf.splitTextToSize(`Note: ${note}`, usable) as string[];
    if (top + lines.length * 4 > PAGE.height - 20) {
      pdf.addPage();
      top = PAGE.margin + 4;
    }
    pdf.text(lines, PAGE.margin, top);
    top += lines.length * 4 + 2;
  }
}
