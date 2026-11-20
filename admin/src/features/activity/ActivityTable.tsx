import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import { ACTION_LABEL, type LogRow } from "./types";

const STYLES: Record<string, string> = {
  CREATE: "bg-green-100 text-green-800 hover:bg-green-100",
  UPDATE: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  DELETE: "bg-red-100 text-red-800 hover:bg-red-100",
};

// The activity table with a loading state and an empty state
export default function ActivityTable({ items, loading }: { items: LogRow[]; loading: boolean }) {
  const message = (content: React.ReactNode) => (
    <TableRow>
      <TableCell colSpan={4}>{content}</TableCell>
    </TableRow>
  );

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>When</TableHead>
            <TableHead>Who</TableHead>
            <TableHead>What</TableHead>
            <TableHead className="hidden md:table-cell">IP address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? message(<Skeleton className="h-12 w-full" />)
            : items.length === 0
              ? message(<p className="py-8 text-center text-muted-foreground">No activity yet</p>)
              : items.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="whitespace-nowrap text-sm">{formatDateTime(l.createdAt)}</TableCell>
                    <TableCell>{l.user ? `${l.user.firstName} ${l.user.lastName}` : "Unknown"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={STYLES[l.action] ?? ""}>
                          {ACTION_LABEL[l.action] ?? l.action}
                        </Badge>
                        <span className="font-semibold capitalize text-navy">{l.entity}</span>
                      </div>
                      {l.details?.path && <p className="mt-1 text-xs text-muted-foreground">{l.details.path}</p>}
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground md:table-cell">{l.ipAddress ?? "-"}</TableCell>
                  </TableRow>
                ))}
        </TableBody>
      </Table>
    </div>
  );
}
