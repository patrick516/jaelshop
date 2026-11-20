// A row of chips for one choice (Size or Colour). Sold-out options are faded but still tappable
type Props = {
  title: string;
  options: string[];
  value: string | null; // the chosen option
  onPick: (option: string) => void;
  inStock: (option: string) => boolean;
};

export default function OptionChips({ title, options, value, onPick, inStock }: Props) {
  if (options.length === 0) return null; // the product has no such choice

  return (
    <div>
      <p className="mb-2 text-sm font-bold text-navy">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onPick(o)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${o === value ? "border-orange-500 bg-orange-500 text-white" : "bg-white text-navy"} ${inStock(o) ? "" : "opacity-40 line-through"}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
