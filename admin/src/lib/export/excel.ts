import type { Workbook } from "exceljs";
import { downloadBlob, fileName } from "./download";
import { fillSummary } from "./excelSummary";
import { fillTable } from "./excelTable";
import type { ReportDoc, Shop } from "./types";

const XLSX_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// A sheet name can be 31 characters at most and cannot contain \ / ? * [ ] :
const sheetName = (title: string): string => title.replace(/[\\/?*[\]:]/g, " ").slice(0, 31);

// Makes the Excel file: a Summary sheet, then one sheet for each table
export async function exportExcel(doc: ReportDoc, shop: Shop): Promise<void> {
  const mod = await import("exceljs"); // loaded only when someone exports, so the admin opens fast
  const ExcelJS = (mod as unknown as { default?: typeof mod }).default ?? mod;
  const workbook: Workbook = new ExcelJS.Workbook();
  workbook.creator = shop.name;
  workbook.created = new Date();

  fillSummary(workbook.addWorksheet("Summary"), doc, shop);
  doc.sections.forEach((s) => fillTable(workbook.addWorksheet(sheetName(s.title)), s));

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(new Blob([buffer as unknown as BlobPart], { type: XLSX_TYPE }), fileName(doc, "xlsx"));
}
