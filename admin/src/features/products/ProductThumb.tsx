import { useState } from "react";
import { ImageOff } from "lucide-react";

// A small square picture. Shows an icon when there is no picture or the link is broken
export default function ProductThumb({ url, alt }: { url?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const box = "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary";

  return (
    <span className={box}>
      {!url || failed ? <ImageOff size={20} className="text-muted-foreground" /> : <img src={url} alt={alt} onError={() => setFailed(true)} className="h-full w-full object-cover" />}
    </span>
  );
}
