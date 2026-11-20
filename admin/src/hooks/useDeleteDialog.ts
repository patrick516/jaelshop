import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

// "Pick an item, confirm, delete it". path is the list address, e.g. "/categories"
export function useDeleteDialog<T extends { id: string }>(path: string, onDone: () => void) {
  const [target, setTarget] = useState<T | null>(null);
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await api.delete(`${path}/${target.id}`);
      toast.success("Deleted");
      setTarget(null);
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete this item");
    }
    setBusy(false);
  };

  return { target, ask: setTarget, cancel: () => setTarget(null), confirm, busy };
}
