import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type Props = { filters: Record<string, string>; onChange: (next: Record<string, string>) => void };

// Search by product name or SKU, and a "low stock only" switch
export default function InventoryFilters({ filters, onChange }: Props) {
  const [term, setTerm] = useState(filters.search);

  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border bg-white p-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onChange({ search: term.trim() });
        }}
        className="relative min-w-[220px] flex-1"
      >
        <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search by product or SKU..." className="pr-10" />
        <Search size={18} className="absolute right-3 top-2.5 text-muted-foreground" />
      </form>
      <div className="flex items-center gap-2">
        <Switch id="low" checked={filters.lowStock === "true"} onCheckedChange={(on) => onChange({ lowStock: on ? "true" : "" })} />
        <label htmlFor="low" className="text-sm font-medium">
          Low stock only
        </label>
      </div>
    </div>
  );
}
