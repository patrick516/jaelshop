import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import OptionSelect from "@/components/shared/OptionSelect";
import { STATUS_OPTIONS } from "./types";
import type { Option } from "./useLookups";
import type { Filters } from "./useProductFilters";

type Props = { filters: Filters; categories: Option[]; onChange: (next: Partial<Filters>) => void };

// Search box, category filter and status filter
export default function ProductFilters({ filters, categories, onChange }: Props) {
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
        <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search by product name..." className="pr-10" />
        <Search size={18} className="absolute right-3 top-2.5 text-muted-foreground" />
      </form>
      <div className="w-full sm:w-52">
        <OptionSelect value={filters.category} onChange={(category) => onChange({ category })} options={categories.map((c) => ({ value: c.slug, label: c.name }))} placeholder="All categories" noneLabel="All categories" />
      </div>
      <div className="w-full sm:w-40">
        <OptionSelect value={filters.status} onChange={(status) => onChange({ status })} options={STATUS_OPTIONS} placeholder="All statuses" noneLabel="All statuses" />
      </div>
    </div>
  );
}
