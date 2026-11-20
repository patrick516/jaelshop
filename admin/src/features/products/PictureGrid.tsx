import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Pic = { key: string; url: string; isMain: boolean };
type Props = { pictures: Pic[]; onRemove: (key: string) => void; onMakeMain?: (key: string) => void };

// The pictures of a product as small squares, with Main and remove buttons
export default function PictureGrid({ pictures, onRemove, onMakeMain }: Props) {
  if (pictures.length === 0) return <p className="text-sm text-muted-foreground">No pictures yet.</p>;

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {pictures.map((p) => (
        <div key={p.key} className="space-y-1">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-secondary">
            <img src={p.url} alt="" className="h-full w-full object-cover" />
            {p.isMain && <span className="absolute left-1 top-1 rounded bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">Main</span>}
          </div>
          <div className="flex items-center justify-between">
            {!p.isMain && onMakeMain ? (
              <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => onMakeMain(p.key)}>
                <Star size={12} className="mr-1" /> Main
              </Button>
            ) : (
              <span />
            )}
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label="Remove picture" onClick={() => onRemove(p.key)}>
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
