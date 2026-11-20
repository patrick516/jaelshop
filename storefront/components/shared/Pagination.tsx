import Link from "next/link";
import { shopHref, type Filters } from "@/lib/shopUrl";

type Props = { current: number; totalPages: number; filters: Filters };

// Previous / Next, shown only when there is more than one page
export default function Pagination({ current, totalPages, filters }: Props) {
  if (totalPages <= 1) return null;
  const go = (page: number) => shopHref({ ...filters, page: String(page) });

  return (
    <div className="flex items-center justify-between pt-2 text-sm font-semibold">
      {current > 1 ? (
        <Link href={go(current - 1)} className="text-orange-500">
          ← Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="text-muted-foreground">
        Page {current} of {totalPages}
      </span>
      {current < totalPages ? (
        <Link href={go(current + 1)} className="text-orange-500">
          Next →
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
