import Link from "next/link";
import { Laptop, Package, PenTool, Printer, Shirt } from "lucide-react";
import type { Category } from "@/types";

// An icon for each category, found by its slug. Any other category gets the box icon
const icons: Record<string, React.ElementType> = {
  stationery: PenTool,
  "office-equipment": Printer,
  electronics: Laptop,
  clothing: Shirt,
};

export default function CategoryCards({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {categories.map((c) => {
        const Icon = icons[c.slug] ?? Package; // ?? means "use Package when there is no icon for this slug"
        return (
          <Link key={c.id} href={`/categories/${c.slug}`} className="flex flex-col items-center gap-2 rounded-xl border bg-white p-4 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <Icon size={26} />
            </span>
            <span className="text-sm font-bold text-navy">{c.name}</span>
            <span className="text-xs font-semibold text-orange-500">Browse →</span>
          </Link>
        );
      })}
    </div>
  );
}
