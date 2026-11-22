import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type Props = { file: File | null; onChange: (file: File | null) => void };

// Choose an optional profile picture and see it before saving
export default function AvatarPicker({ file, onChange }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview); // frees the memory used by the preview
    },
    [preview],
  );

  const pick = (e: ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0];
    e.target.value = ""; // so the same file can be chosen again
    if (!chosen) return;
    if (!TYPES.includes(chosen.type)) return setError("Please choose a JPG, PNG, WebP or GIF picture");
    if (chosen.size > 25 * 1024 * 1024) return setError("That picture is too big (25 MB at most)");
    setError("");
    onChange(chosen);
  };

  return (
    <div className="flex items-center gap-4">
      <button type="button" onClick={() => input.current?.click()} aria-label="Choose a profile picture" className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed bg-secondary">
        {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : <User size={32} className="text-muted-foreground" />}
      </button>
      <div className="space-y-1">
        <input ref={input} type="file" accept={TYPES.join(",")} className="hidden" onChange={pick} />
        <p className="text-sm font-semibold text-navy">Profile picture (optional)</p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => input.current?.click()}>
            {file ? "Change" : "Choose picture"}
          </Button>
          {file && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
              Remove
            </Button>
          )}
        </div>
        {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
      </div>
    </div>
  );
}
