import type { ReactNode } from "react";

type Props = { title: string; subtitle?: string; children?: ReactNode }; // children is the space for buttons on the right

// The title block at the top of every admin page
export default function PageHeader({ title, subtitle, children }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-3xl font-extrabold text-navy">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
