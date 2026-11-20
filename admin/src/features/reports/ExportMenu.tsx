import { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { exportExcel } from "@/lib/export/excel";
import { exportPdf } from "@/lib/export/pdf";
import type { ReportDoc, Shop } from "@/lib/export/types";
import type { Settings } from "@/types";

// "Export" button with Excel and PDF. The file holds exactly what is on screen: the chosen dates and filters
export default function ExportMenu({ doc }: { doc: ReportDoc }) {
  const { user } = useAuth();
  const { data: settings } = useFetch<Settings>("/settings");
  const [busy, setBusy] = useState(false);

  const shop: Shop = {
    name: settings?.storeName ?? "JAEL Enterprise",
    whatsapp: settings?.whatsappNumber ?? "",
    preparedBy: user ? `${user.firstName} ${user.lastName}` : "",
  };

  const run = async (make: (d: ReportDoc, s: Shop) => Promise<void>, what: string) => {
    setBusy(true);
    try {
      await make(doc, shop);
      toast.success(`${what} file downloaded`);
    } catch (e) {
      console.error(e);
      toast.error(`Could not create the ${what} file`);
    }
    setBusy(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={busy}>
          <Download size={16} className="mr-2" /> {busy ? "Preparing..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => run(exportExcel, "Excel")}>
          <FileSpreadsheet size={16} className="mr-2 text-green-600" /> Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => run(exportPdf, "PDF")}>
          <FileText size={16} className="mr-2 text-red-600" /> PDF (.pdf)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
