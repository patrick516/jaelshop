// What to show while a page has no data yet: a pulsing box while loading, a red message after an error
export default function LoadState({ loading, error }: { loading: boolean; error: string }) {
  if (loading) return <div className="h-40 animate-pulse rounded-xl bg-secondary" />;
  return <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error || "Nothing to show"}</p>;
}
