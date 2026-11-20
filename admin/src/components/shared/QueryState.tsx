import { Skeleton } from "@/components/ui/skeleton";

// What to show while a page has no data yet: a pulsing box while loading, a red message after an error
export default function QueryState({ loading, error }: { loading: boolean; error: string }) {
  if (loading) return <Skeleton className="h-64 w-full" />;
  if (error) return <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p>;
  return null;
}
