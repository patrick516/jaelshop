import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type Props = { open: boolean; title: string; description: string; confirmLabel: string; busy: boolean; onConfirm: () => void; onCancel: () => void };

// An "Are you sure?" box for dangerous actions like delete
export default function ConfirmDialog({ open, title, description, confirmLabel, busy, onConfirm, onCancel }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={busy}
            className="bg-destructive hover:bg-destructive/90"
            onClick={(e) => {
              e.preventDefault(); // keep the box open until the request finishes
              onConfirm();
            }}
          >
            {busy ? "Please wait..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
