import PageHeader from "@/components/shared/PageHeader";
import OptionSelect from "@/components/shared/OptionSelect";
import Pagination from "@/components/shared/Pagination";
import { usePagedList } from "@/hooks/usePagedList";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import ActivityTable from "./ActivityTable";
import { ENTITY_OPTIONS, type LogRow } from "./types";

// Everything staff created, changed or deleted (Administrators only)
export default function ActivityPage() {
  const { filters, change } = useUrlFilters(["entity", "page"]);
  const { items, pagination, error, loading } = usePagedList<LogRow>("/staff/activity", filters, 20);

  return (
    <>
      <PageHeader title="Activity Logs" subtitle="Who changed what, and when." />
      <div className="mb-4 w-full rounded-xl border bg-white p-3 sm:w-64">
        <OptionSelect value={filters.entity} onChange={(entity) => change({ entity })} options={ENTITY_OPTIONS} placeholder="Everything" noneLabel="Everything" />
      </div>
      {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p> : <ActivityTable items={items} loading={loading} />}
      <Pagination page={Number(filters.page)} totalPages={pagination?.totalPages ?? 1} total={pagination?.total ?? 0} onPage={(p) => change({ page: String(p) })} />
    </>
  );
}
