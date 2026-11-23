import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Item = { id: string; name: string };

type Props = {
  value: string; // the id of the chosen item, "" for none
  onChange: (id: string) => void;
  options: Item[];
  placeholder: string; // shown when nothing is chosen
  noneLabel?: string; // adds a first row that clears the choice (for optional fields like brand)
  kind: string; // "category" or "brand", used in the texts
  onCreate: (name: string) => Promise<Item>; // saves a new one and returns it
};

// One row of the list: the chosen row gets a tick
const Row = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) => (
  <button type="button" onClick={onClick} className={cn("flex w-full items-center justify-between rounded px-2 py-2 text-left text-sm hover:bg-secondary", active && "bg-secondary font-semibold")}>
    <span className="truncate">{children}</span>
    {active && <Check size={16} className="shrink-0 text-orange-500" />}
  </button>
);

// A dropdown you can search. When the typed name does not exist, it offers to create it
export default function CreatableSelect({ value, onChange, options, placeholder, noneLabel, kind, onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState(""); // what is typed in the search field
  const [busy, setBusy] = useState(false); // true while a new item is being saved
  const [error, setError] = useState("");
  const box = useRef<HTMLDivElement>(null);

  // Close the list when the user clicks anywhere outside this box
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const chosen = options.find((o) => o.id === value);
  const text = term.trim();
  const lower = text.toLowerCase();
  const shown = options.filter((o) => o.name.toLowerCase().includes(lower)); // the names that contain what was typed
  const exact = options.find((o) => o.name.toLowerCase() === lower); // the same name, ignoring capital letters
  const canCreate = text !== "" && !exact; // only offer "Create" when the name is really new

  const pick = (id: string) => {
    onChange(id);
    setOpen(false);
    setTerm("");
    setError("");
  };

  const create = async () => {
    setBusy(true);
    setError("");
    try {
      const made = await onCreate(text); // saved in the database, then selected
      pick(made.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : `Could not create the ${kind}`);
    } finally {
      setBusy(false);
    }
  };

  // Enter must never submit the whole product form, so it only picks or creates here
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (exact) pick(exact.id);
    else if (shown.length === 1) pick(shown[0].id);
    else if (shown.length === 0 && canCreate) create();
  };

  return (
    <div ref={box} className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm", !chosen && "text-muted-foreground")}
      >
        <span className="truncate">{chosen ? chosen.name : (noneLabel ?? placeholder)}</span>
        <ChevronDown size={16} className="shrink-0 opacity-50" />
      </button>

      {open && (
        <div className="space-y-2 rounded-md border bg-white p-2">
          <Input
            autoFocus
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              setError("");
            }}
            onKeyDown={onKey}
            placeholder={`Search or type a new ${kind}...`}
          />
          <div className="max-h-48 overflow-y-auto">
            {noneLabel && !text && (
              <Row active={!value} onClick={() => pick("")}>
                {noneLabel}
              </Row>
            )}
            {shown.map((o) => (
              <Row key={o.id} active={o.id === value} onClick={() => pick(o.id)}>
                {o.name}
              </Row>
            ))}
            {canCreate && (
              <button type="button" disabled={busy} onClick={create} className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm font-semibold text-orange-600 hover:bg-orange-50 disabled:opacity-60">
                <Plus size={16} className="shrink-0" /> {busy ? "Saving..." : `Create "${text}" as a new ${kind}`}
              </button>
            )}
            {!canCreate && shown.length === 0 && <p className="px-2 py-2 text-sm text-muted-foreground">Nothing yet. Type a name to add one.</p>}
          </div>
          {error && <p className="rounded-lg bg-red-50 p-2 text-sm font-semibold text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
}
