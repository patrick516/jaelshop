import type { Cell as SheetCell, Row, Worksheet } from "exceljs";
import { isNumeric } from "./cells";
import { BORDER, LIGHT, NAVY, hex } from "./theme";
import type { Column, ColumnType, Section } from "./types";

type Rgb = readonly [number, number, number];

const FORMATS: Record<ColumnType, string> = { text: "General", number: "#,##0", money: '"MK" #,##0', percent: '0.0"%"' };
const fill = (color: Rgb) => ({ type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: hex(color) } });

// Number format and alignment for every cell of a row, then anything extra
function styleRow(row: Row, columns: Column[], extra?: (cell: SheetCell) => void) {
  row.eachCell({ includeEmpty: true }, (cell, col) => {
    const type = columns[col - 1]?.type ?? "text";
    cell.numFmt = FORMATS[type];
    cell.alignment = { horizontal: isNumeric(type) ? "right" : "left", vertical: "middle" };
    extra?.(cell);
  });
}

// One table on its own sheet: a title, a navy header row, striped rows, filters and a bold total row
export function fillTable(ws: Worksheet, s: Section) {
  const n = s.columns.length;
  ws.columns = s.columns.map((c) => ({ width: c.width ?? (c.type === "text" ? 34 : 16) }));
  ws.views = [{ state: "frozen", ySplit: 2, showGridLines: false }]; // the title and header stay while scrolling

  ws.mergeCells(1, 1, 1, n);
  const title = ws.getCell(1, 1);
  title.value = s.title;
  title.font = { size: 14, bold: true, color: { argb: hex(NAVY) } };
  ws.getRow(1).height = 26;

  const head = ws.addRow(s.columns.map((c) => c.header));
  head.height = 22;
  styleRow(head, s.columns, (cell) => {
    cell.fill = fill(NAVY);
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
  });

  s.rows.forEach((values, i) => {
    styleRow(ws.addRow(values), s.columns, (cell) => {
      if (i % 2 === 1) cell.fill = fill(LIGHT);
      cell.border = { bottom: { style: "thin", color: { argb: hex(BORDER) } } };
    });
  });
  if (s.rows.length > 0) ws.autoFilter = { from: { row: 2, column: 1 }, to: { row: 2 + s.rows.length, column: n } };

  if (s.total) {
    styleRow(ws.addRow(s.total), s.columns, (cell) => {
      cell.font = { bold: true, color: { argb: hex(NAVY) } };
      cell.fill = fill([226, 232, 240]);
      cell.border = { top: { style: "medium", color: { argb: hex(NAVY) } } };
    });
  }
}
