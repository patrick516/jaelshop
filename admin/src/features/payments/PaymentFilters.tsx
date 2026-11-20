import OptionSelect from "@/components/shared/OptionSelect";
import { METHOD_OPTIONS, PAY_STATUS_OPTIONS } from "./types";

type Props = { filters: Record<string, string>; onChange: (next: Record<string, string>) => void };

// Status filter and method filter
export default function PaymentFilters({ filters, onChange }: Props) {
  return (
    <div className="mb-4 flex flex-wrap gap-3 rounded-xl border bg-white p-3">
      <div className="w-full sm:w-44">
        <OptionSelect value={filters.status} onChange={(status) => onChange({ status })} options={PAY_STATUS_OPTIONS} placeholder="All statuses" noneLabel="All statuses" />
      </div>
      <div className="w-full sm:w-52">
        <OptionSelect value={filters.method} onChange={(method) => onChange({ method })} options={METHOD_OPTIONS} placeholder="All methods" noneLabel="All methods" />
      </div>
    </div>
  );
}
