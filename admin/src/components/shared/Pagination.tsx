import { Button } from "@/components/ui/button";

type Props = { page: number; totalPages: number; total: number; onPage: (page: number) => void };

// "12 items" on the left, Previous / Next on the right (only when there is more than one page)
export default function Pagination({ page, totalPages, total, onPage }: Props) {
  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between pt-4 text-sm">
      <span className="text-muted-foreground">
        {total} {total === 1 ? "item" : "items"}
      </span>
      {totalPages > 1 && (
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
            Previous
          </Button>
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
