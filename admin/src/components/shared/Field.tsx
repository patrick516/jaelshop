import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type Props = { label: string; htmlFor?: string; hint?: string; children: ReactNode };

// A label, the input and a small hint under it
export default function Field({ label, htmlFor, hint, children }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
