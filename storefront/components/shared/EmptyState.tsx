import Link from "next/link";

// A centred message with one link, for empty carts and missing orders
export default function EmptyState({ message, href, label }: { message: string; href: string; label: string }) {
  return (
    <div className="rounded-xl border bg-white p-8 text-center">
      <p className="font-semibold text-navy">{message}</p>
      <Link href={href} className="mt-2 inline-block text-sm font-semibold text-orange-500">
        {label}
      </Link>
    </div>
  );
}
