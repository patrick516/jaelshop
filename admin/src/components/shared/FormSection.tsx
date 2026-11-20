import type { ReactNode } from "react";

// A titled part of a long form, used inside pop-ups
export default function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="border-b pb-2 text-base font-extrabold text-navy">{title}</h3>
      {children}
    </section>
  );
}
