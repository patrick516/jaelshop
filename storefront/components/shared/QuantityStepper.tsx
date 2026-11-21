import { Minus, Plus } from "lucide-react";

type Props = { value: number; max?: number; onChange: (n: number) => void };

// A - 1 + control. max stops the number going above the stock, and the + button fades when it is reached
export default function QuantityStepper({ value, max = 99, onChange }: Props) {
  const btn = "flex h-11 w-11 items-center justify-center text-navy disabled:opacity-30";
  return (
    <div className="flex items-center rounded-full border bg-white">
      <button type="button" aria-label="Less" onClick={() => onChange(Math.max(1, value - 1))} className={btn}>
        <Minus size={16} />
      </button>
      <span className="w-8 text-center font-bold text-navy">{value}</span>
      <button type="button" aria-label="More" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className={btn}>
        <Plus size={16} />
      </button>
    </div>
  );
}
