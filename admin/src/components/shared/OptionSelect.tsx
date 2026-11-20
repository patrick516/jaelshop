import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Opt = { value: string; label: string };

const NONE = "__none"; // the select cannot use an empty text as a value, so "no choice" gets this stand-in

type Props = { value: string; onChange: (value: string) => void; options: Opt[]; placeholder: string; noneLabel?: string };

// A dropdown for a list of {value, label}. noneLabel adds a first choice that clears the selection
export default function OptionSelect({ value, onChange, options, placeholder, noneLabel }: Props) {
  return (
    <Select value={value || (noneLabel ? NONE : "")} onValueChange={(v) => onChange(v === NONE ? "" : v)}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {noneLabel && <SelectItem value={NONE}>{noneLabel}</SelectItem>}
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
