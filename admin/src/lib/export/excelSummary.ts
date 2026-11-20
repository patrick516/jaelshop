import type { Worksheet } from "exceljs";
import { stamp } from "./cells";
import { GREEN, GREY_TEXT, NAVY, RED, hex } from "./theme";
import type { ReportDoc, Shop } from "./types";

type Rgb = readonly [number, number, number];
type Look = { size?: number; bold?: boolean; color?: Rgb; valueColor?: Rgb };

// The first sheet: shop name, report title, period, the big numbers and the notes
export function fillSummary(ws: Worksheet, doc: ReportDoc, shop: Shop) {
  ws.views = [{ showGridLines: false }];
  ws.columns = [{ width: 38 }, { width: 32 }];
  let row = 1;

  const line = (label: string, value: string, look: Look = {}) => {
    const a = ws.getCell(row, 1);
    const b = ws.getCell(row, 2);
    a.value = label;
    b.value = value;
    a.font = { size: look.size ?? 11, bold: look.bold ?? false, color: { argb: hex(look.color ?? NAVY) } };
    b.font = { size: look.size ?? 11, bold: true, color: { argb: hex(look.valueColor ?? look.color ?? NAVY) } };
    b.alignment = { horizontal: "right" };
    row++;
  };

  line(shop.name, "", { size: 18, bold: true });
  line(doc.title, "", { size: 13, bold: true, color: GREY_TEXT });
  line("Period", doc.period);
  doc.filters.forEach((f) => line("Filter", f));
  line("Generated", `${stamp()}${shop.preparedBy ? ` by ${shop.preparedBy}` : ""}`);
  row++;
  doc.highlights.forEach((h) => line(h.label, h.value, { size: 12, valueColor: h.tone === "good" ? GREEN : h.tone === "bad" ? RED : NAVY }));
  if (doc.notes.length > 0) row++;
  doc.notes.forEach((note) => {
    ws.mergeCells(row, 1, row, 2);
    const cell = ws.getCell(row, 1);
    cell.value = note;
    cell.font = { size: 10, italic: true, color: { argb: hex(GREY_TEXT) } };
    cell.alignment = { wrapText: true, vertical: "top" };
    ws.getRow(row).height = 32;
    row++;
  });
}
