"use client"; // uses hover state

import Link from "next/link";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import type { Product } from "@/types";

const SHOWN = 4; // small pictures in the hover strip

// The picture area of a product card. On a computer, hovering the card shows small pictures along the
// bottom, and hovering one of them shows it big. Clicking anything opens the product page
export default function CardImage({ product }: { product: Product }) {
  const pictures = [...product.images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)); // main picture first
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState<string[]>([]); // ids of pictures that would not load
  const href = `/product/${product.slug}`;
  const current = pictures[index];
  const extra = pictures.length - SHOWN;

  return (
    <div className="group relative aspect-square bg-secondary" onMouseLeave={() => setIndex(0)}>
      <Link href={href} className="flex h-full w-full items-center justify-center p-2">
        {current && !broken.includes(current.id) ? (
          <img src={current.url} alt={current.altText ?? product.name} onError={() => setBroken((b) => [...b, current.id])} className="h-full w-full object-contain" />
        ) : (
          <ImageOff className="text-muted-foreground" size={32} />
        )}
      </Link>

      {/* Only on computers (md and up), only while hovering, only when there is more than one picture */}
      {pictures.length > 1 && (
        <div className="absolute inset-x-0 bottom-2 hidden justify-center md:group-hover:flex">
          <div className="flex items-center gap-1.5 rounded-full bg-white/90 p-1.5 shadow">
            {pictures.slice(0, SHOWN).map((p, i) => (
              <Link
                key={p.id}
                href={href}
                aria-label={`Picture ${i + 1}`}
                onMouseEnter={() => setIndex(i)}
                className={`h-8 w-8 overflow-hidden rounded-full ring-2 ${i === index ? "ring-orange-500" : "ring-white"}`}
              >
                <img src={p.url} alt="" className="h-full w-full object-cover" />
              </Link>
            ))}
            {extra > 0 && <span className="px-1 text-xs font-bold text-navy">+{extra}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
