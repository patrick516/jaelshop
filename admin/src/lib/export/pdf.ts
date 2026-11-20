import { downloadBlob, fileName } from "./download";
import { drawFooters, drawHeader } from "./pdfBrand";
import { drawHighlights, drawNotes } from "./pdfBlocks";
import { drawSection, type AutoTable } from "./pdfTable";
import type { ReportDoc, Shop } from "./types";

// Makes the PDF: header band, the big numbers, the tables, the notes and page numbers
export async function exportPdf(doc: ReportDoc, shop: Shop): Promise<void> {
  // loaded only when someone exports, so the admin opens fast
  const [{ jsPDF }, tableModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const found = tableModule as unknown as { autoTable?: AutoTable; default?: AutoTable };
  const autoTable = (found.autoTable ?? found.default) as AutoTable;

  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  pdf.setProperties({ title: `${shop.name} - ${doc.title}`, author: shop.name });

  let y = drawHeader(pdf, doc, shop);
  y = drawHighlights(pdf, doc.highlights, y);
  for (const section of doc.sections) y = drawSection(pdf, autoTable, section, y);
  drawNotes(pdf, doc.notes, y);
  drawFooters(pdf, doc, shop);

  downloadBlob(pdf.output("blob"), fileName(doc, "pdf"));
}
