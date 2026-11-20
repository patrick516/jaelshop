import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Field from "@/components/shared/Field";
import { daysAgo, today } from "@/lib/dates";

type Props = { from: string; to: string; onChange: (from: string, to: string) => void };

const PRESETS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

// Two date boxes and quick buttons for the last 7, 30 or 90 days
export default function DateRange({ from, to, onChange }: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border bg-white p-3">
      <Field label="From" htmlFor="r-from">
        <Input id="r-from" type="date" value={from} max={to} onChange={(e) => e.target.value && onChange(e.target.value, to)} />
      </Field>
      <Field label="To" htmlFor="r-to">
        <Input id="r-to" type="date" value={to} min={from} max={today()} onChange={(e) => e.target.value && onChange(from, e.target.value)} />
      </Field>
      <div className="flex gap-1 pb-0.5">
        {PRESETS.map((p) => (
          <Button key={p.label} type="button" variant="outline" size="sm" onClick={() => onChange(daysAgo(p.days), today())}>
            {p.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
