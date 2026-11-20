// One report, described once. The Excel file and the PDF are both made from this
export type ColumnType = "text" | "number" | "money" | "percent";
export type Cell = string | number | null; // null shows as a dash
export type Column = { header: string; type: ColumnType; width?: number }; // width is for Excel, in characters
export type Section = { title: string; columns: Column[]; rows: Cell[][]; total?: Cell[] };
export type Highlight = { label: string; value: string; tone?: "good" | "bad" };

export type ReportDoc = {
  title: string; // "Profit report"
  period: string; // "1 Nov 2026 to 30 Nov 2026"
  filters: string[]; // what was chosen, e.g. "Grouped by day"
  highlights: Highlight[]; // the big numbers at the top
  sections: Section[]; // the tables
  notes: string[]; // small print under the tables
};

// Who the file is from
export type Shop = { name: string; whatsapp: string; preparedBy: string };
