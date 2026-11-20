"use client"; // uses state and the scroll position

import { useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import type { ProductImage } from "@/types";

// One picture. Shows an icon if the picture link is broken
function Picture({ url, alt }: { url: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <ImageOff className="text-muted-foreground" size={48} />;
  return <img src={url} alt={alt} onError={() => setFailed(true)} className="h-full w-full object-contain" />;
}

// Swipe sideways on a phone, tap a dot on a computer
export default function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0); // which picture is showing
  const sorted = [...images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)); // main picture first

  return (
    <div>
      <div
        ref={ref}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl bg-secondary [scrollbar-width:none]"
      >
        {sorted.length === 0 ? (
          <div className="flex aspect-square w-full shrink-0 items-center justify-center">
            <ImageOff className="text-muted-foreground" size={48} />
          </div>
        ) : (
          sorted.map((img) => (
            <div key={img.id} className="flex aspect-square w-full shrink-0 snap-center items-center justify-center p-4">
              <Picture url={img.url} alt={img.altText ?? name} />
            </div>
          ))
        )}
      </div>
      {sorted.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              aria-label={`Picture ${i + 1}`}
              onClick={() => ref.current?.scrollTo({ left: i * ref.current.clientWidth, behavior: "smooth" })}
              className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-orange-500" : "bg-navy/20"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
