import type { jsPDF } from "jspdf";
import { cellText, isNumeric } from "./cells";
import { PAGE } from "./pdfBrand";
import { BORDER, GREY_TEXT, LIGHT, NAVY, ORANGE } from "./theme";
import type { Cell, Section } from "./types";

// The table drawing function of the jspdf-autotable library
export type AutoTable = (doc: unknown, options: Record<string, unknown>) => void;

// One section: a heading with an orange underline and a table with a navy header, striped rows and a total row
export function drawSection(pdf: jsPDF, autoTable: AutoTable, s: Section, startY: number): number {
  const { margin, height } = PAGE;
  let y = startY;
  if (y > height - 60) {
    pdf.addPage(); // not enough room left for a heading and a few rows
    y = margin + 4;
  }
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11.5);
  pdf.setTextColor(...NAVY);
  pdf.text(s.title, margin, y + 4);
  pdf.setFillColor(...ORANGE);
  pdf.rect(margin, y + 6.5, 12, 0.9, "F");

  if (s.rows.length === 0) {
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(9);
    pdf.setTextColor(...GREY_TEXT);
    pdf.text("No data for this period.", margin, y + 14);
    return y + 24;
  }

  const right = s.columns.flatMap((c, i) => (isNumeric(c.type) ? [i] : [])); // numbers line up on the right
  const text = (row: Cell[]) => row.map((value, i) => cellText(value, s.columns[i].type));

  autoTable(pdf, {
    startY: y + 10,
    head: [s.columns.map((c) => c.header)],
    body: s.rows.map(text),
    foot: s.total ? [text(s.total)] : undefined,
    showFoot: "lastPage",
    margin: { left: margin, right: margin, bottom: 18 },
    styles: { font: "helvetica", fontSize: 9, cellPadding: 2.6, textColor: [...NAVY], lineColor: [...BORDER] },
    headStyles: { fillColor: [...NAVY], textColor: [255, 255, 255], fontStyle: "bold" },
    footStyles: { fillColor: [226, 232, 240], textColor: [...NAVY], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [...LIGHT] },
    didParseCell: (d: { column: { index: number }; cell: { styles: { halign: string } } }) => {
      if (right.includes(d.column.index)) d.cell.styles.halign = "right";
    },
  });

  const last = (pdf as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable;
  return last.finalY + 10;
}
