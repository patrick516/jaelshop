import Link from "next/link";
import type { Category } from "@/types";
import { shopHref } from "@/lib/shopUrl";

type Props = { categories: Category[]; active?: string; search?: string }; // active is the chosen slug

// Filter chips. overflow-x-auto lets them scroll sideways on a phone
export default function CategoryChips({ categories, active, search }: Props) {
  // Orange when selected, white otherwise
  const chip = (on: boolean) => `shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold ${on ? "border-orange-500 bg-orange-500 text-white" : "bg-white text-navy"}`;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Link href={shopHref({ search })} className={chip(!active)}>
        All
      </Link>
      {categories.map((c) => (
        <Link key={c.id} href={shopHref({ category: c.slug, search })} className={chip(c.slug === active)}>
          {c.name}
        </Link>
      ))}
    </div>
  );
}
