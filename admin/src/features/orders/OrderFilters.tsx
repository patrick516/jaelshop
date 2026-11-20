import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import OptionSelect from "@/components/shared/OptionSelect";
import { STATUS_OPTIONS } from "./types";

type Props = { filters: Record<string, string>; onChange: (next: Record<string, string>) => void };

// Search by order number or customer name, plus a status filter
export default function OrderFilters({ filters, onChange }: Props) {
  const [term, setTerm] = useState(filters.search);

  return (
    <div className="mb-4 flex flex-wrap gap-3 rounded-xl border bg-white p-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onChange({ search: term.trim() });
        }}
        className="relative min-w-[220px] flex-1"
      >
        <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search by order number or name..." className="pr-10" />
        <Search size={18} className="absolute right-3 top-2.5 text-muted-foreground" />
      </form>
      <div className="w-full sm:w-44">
        <OptionSelect value={filters.status} onChange={(status) => onChange({ status })} options={STATUS_OPTIONS} placeholder="All statuses" noneLabel="All statuses" />
      </div>
    </div>
  );
}
