type Props = { label: string; value: string; hint?: string };

// A small white card with one number
export default function StatCard({ label, value, hint }: Props) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-extrabold text-navy">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
