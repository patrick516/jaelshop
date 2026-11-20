import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadPicture } from "@/lib/upload";

const MAX_FILES = 10; // pictures per selection

type Props = {
  onUploaded: (urls: string[]) => void | Promise<void>;
  label?: string;
};

// A button that opens the file picker (several pictures at once), uploads them one after the other
// and hands back all their addresses together
export default function PictureUploadButton({
  onUploaded,
  label = "Upload pictures",
}: Props) {
  const input = useRef<HTMLInputElement>(null);
  const latest = useRef(onUploaded); // always the newest handler, even if the form changed during the upload
  useEffect(() => {
    latest.current = onUploaded;
  });
  const [progress, setProgress] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // so the same files can be chosen again
    if (files.length === 0) return;

    setError("");
    setBusy(true);
    const chosen = files.slice(0, MAX_FILES);
    const urls: string[] = [];
    const problems: string[] = [];

    for (let i = 0; i < chosen.length; i++) {
      setProgress(`Uploading ${i + 1} of ${chosen.length}...`);
      try {
        urls.push(await uploadPicture(chosen[i]));
      } catch (err) {
        problems.push(
          `${chosen[i].name}: ${err instanceof Error ? err.message : "upload failed"}`,
        );
      }
    }
    if (files.length > MAX_FILES)
      problems.push(`Only the first ${MAX_FILES} pictures were used`);

    try {
      if (urls.length > 0) await latest.current(urls); // the pictures that worked are kept even if others failed
    } catch (err) {
      problems.push(
        err instanceof Error ? err.message : "Could not save the pictures",
      );
    }
    setError(problems.join(". "));
    setProgress("");
    setBusy(false);
  };

  return (
    <div className="space-y-2">
      <input
        ref={input}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onFiles}
      />
      <Button
        type="button"
        variant="outline"
        disabled={busy}
        onClick={() => input.current?.click()}
      >
        <ImagePlus size={16} className="mr-2" /> {busy ? progress : label}
      </Button>
      {error && (
        <p className="text-sm font-semibold text-destructive">{error}</p>
      )}
    </div>
  );
}
