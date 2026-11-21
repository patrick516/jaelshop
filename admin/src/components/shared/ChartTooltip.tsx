import type { ReactNode } from "react";

type Entry = { name?: string | number; value?: number | string; color?: string; payload?: { tip?: string } };
type Props = {
  active?: boolean; // given by the chart while the mouse is over it
  payload?: Entry[];
  label?: ReactNode;
  format: (value: number, name: string) => string; // how a value is written, e.g. as Kwacha
};

// The small card shown when you hover a chart: the full date, then every value with its colour dot
export default function ChartTooltip({ active, payload, label, format }: Props) {
  if (!active || !payload?.length) return null;
  const title = payload[0].payload?.tip ?? label; // the full date when the chart supplied one

  return (
    <div className="min-w-[150px] rounded-sm border bg-white px-3 py-2 text-sm shadow-lg">
      <p className="mb-1 font-bold text-navy">{title}</p>
      {payload.map((e) => (
        <p key={String(e.name)} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: e.color }} />
            {e.name}
          </span>
          <span className="font-semibold text-navy">{format(Number(e.value), String(e.name))}</span>
        </p>
      ))}
    </div>
  );
}
