import type { jsPDF } from "jspdf";
import { stamp } from "./cells";
import { BORDER, GREY_TEXT, NAVY, ORANGE } from "./theme";
import type { ReportDoc, Shop } from "./types";

export const PAGE = { width: 210, height: 297, margin: 14 }; // A4, in millimetres

// The navy band at the top of the first page, then who made the file and the filters. Returns where the next block starts
export function drawHeader(pdf: jsPDF, doc: ReportDoc, shop: Shop): number {
  const { width, margin } = PAGE;
  pdf.setFillColor(...NAVY);
  pdf.rect(0, 0, width, 32, "F");
  pdf.setFillColor(...ORANGE);
  pdf.roundedRect(margin, 9, 14, 14, 3, 3, "F"); // the orange brand square
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(17);
  pdf.text("J", margin + 7, 19.2, { align: "center" });
  pdf.setFontSize(15);
  pdf.text(shop.name, margin + 19, 16);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  if (shop.whatsapp) pdf.text(`WhatsApp +${shop.whatsapp}`, margin + 19, 21.5);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text(doc.title, width - margin, 15, { align: "right" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(doc.period, width - margin, 22, { align: "right" });

  const info = [`Generated ${stamp()}${shop.preparedBy ? ` by ${shop.preparedBy}` : ""}`, ...doc.filters.map((f) => `Filter: ${f}`)];
  pdf.setFontSize(8.5);
  pdf.setTextColor(...GREY_TEXT);
  info.forEach((line, i) => pdf.text(line, margin, 40 + i * 4.5));
  return 40 + info.length * 4.5 + 4;
}

// On every page: a thin line, the shop and report name on the left, "Page 1 of 3" on the right
export function drawFooters(pdf: jsPDF, doc: ReportDoc, shop: Shop) {
  const { width, height, margin } = PAGE;
  const pages = pdf.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    pdf.setPage(i);
    pdf.setDrawColor(...BORDER);
    pdf.line(margin, height - 12, width - margin, height - 12);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...GREY_TEXT);
    pdf.text(`${shop.name}  |  ${doc.title}`, margin, height - 7);
    pdf.text(`Page ${i} of ${pages}`, width - margin, height - 7, { align: "right" });
  }
}
