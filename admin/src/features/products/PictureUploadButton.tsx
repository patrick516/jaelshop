import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadPicture } from "@/lib/upload";

type Props = { onUploaded: (url: string) => void | Promise<void>; label?: string };

// A button that opens the file picker, uploads the chosen picture and hands back its address
export default function PictureUploadButton({ onUploaded, label = "Upload picture" }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // so the same file can be chosen again
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      await onUploaded(await uploadPicture(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
    setBusy(false);
  };

  return (
    <div className="space-y-2">
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={onFile} />
      <Button type="button" variant="outline" disabled={busy} onClick={() => input.current?.click()}>
        <ImagePlus size={16} className="mr-2" /> {busy ? "Uploading..." : label}
      </Button>
      {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
    </div>
  );
}
