import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/shared/PageHeader";
import { useFetch } from "@/hooks/useFetch";
import type { Settings } from "@/types";
import SettingsForm from "./SettingsForm";

// Loads the saved settings, then shows the form filled in
export default function SettingsPage() {
  const { data, error, loading } = useFetch<Settings>("/settings");

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Your shop name, WhatsApp number and payment numbers."
      />
      {loading && <Skeleton className="h-72 max-w-2xl" />}
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">
          {error}
        </p>
      )}
      {data && <SettingsForm initial={data} />}
    </>
  );
}
