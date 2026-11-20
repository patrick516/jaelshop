import type { FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  busy: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  children: ReactNode;
  className?: string; // e.g. "sm:max-w-3xl" for a wider pop-up
  disabled?: boolean; // keeps Save switched off while the form is still loading
};

// A pop-up form with Cancel and Save buttons. Mount it only while it should be visible
export default function FormDialog({ title, busy, error, onClose, onSubmit, children, className, disabled }: Props) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn("max-h-[90vh] overflow-y-auto", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={busy || disabled} className="bg-orange-500 hover:bg-orange-600">
              {busy ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
