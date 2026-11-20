"use client"; // uses state and touch events

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import type { ProductImage } from "@/types";

// One picture. Shows an icon if the picture link is broken
function Picture({ url, alt }: { url: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <ImageOff className="text-muted-foreground" size={48} />;
  return <img src={url} alt={alt} onError={() => setFailed(true)} className="h-full w-full object-contain" />;
}

const arrow = "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow";

// A big main picture with small pictures under it. Click a small one to show it big
export default function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const sorted = [...images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)); // main picture first
  const [index, setIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const count = sorted.length;
  const current = sorted[index];
  const go = (n: number) => setIndex((n + count) % count); // wraps around at both ends

  // A swipe of more than 50 pixels changes the picture
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null || count < 2) return;
    const move = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(move) > 50) go(index + (move < 0 ? 1 : -1));
    touchStart.current = null;
  };

  return (
    <div className="space-y-3">
      <div
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-secondary p-4"
        onTouchStart={(e) => {
          touchStart.current = e.touches[0].clientX;
        }}
        onTouchEnd={onTouchEnd}
      >
        {current ? <Picture key={current.id} url={current.url} alt={current.altText ?? name} /> : <ImageOff className="text-muted-foreground" size={48} />}
        {count > 1 && (
          <>
            <button aria-label="Previous picture" onClick={() => go(index - 1)} className={`${arrow} left-2`}>
              <ChevronLeft size={20} />
            </button>
            <button aria-label="Next picture" onClick={() => go(index + 1)} className={`${arrow} right-2`}>
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-3 overflow-x-auto p-1">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              aria-label={`Show picture ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-secondary ${i === index ? "border-orange-500 ring-2 ring-orange-500/30" : "border-transparent hover:border-navy/30"}`}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
