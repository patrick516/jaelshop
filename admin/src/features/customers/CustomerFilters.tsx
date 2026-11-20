import { Switch } from "@/components/ui/switch";
import SearchBox from "@/components/shared/SearchBox";

type Props = { filters: Record<string, string>; onChange: (next: Record<string, string>) => void };

// Search by name or phone, and an "owing only" switch
export default function CustomerFilters({ filters, onChange }: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border bg-white p-3">
      <SearchBox key={filters.search} initial={filters.search} placeholder="Search by name, phone or email..." onSearch={(search) => onChange({ search })} />
      <div className="flex items-center gap-2">
        <Switch id="owing" checked={filters.owing === "true"} onCheckedChange={(on) => onChange({ owing: on ? "true" : "" })} />
        <label htmlFor="owing" className="text-sm font-medium">
          Owing only
        </label>
      </div>
    </div>
  );
}
