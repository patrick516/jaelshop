import { useState } from "react";
import { toast } from "sonner";

// Runs a save request with a busy flag and an error message. Returns true when it worked
export function useSubmit() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async (request: () => Promise<unknown>, success: string): Promise<boolean> => {
    setError("");
    setBusy(true);
    try {
      await request();
      toast.success(success);
      setBusy(false);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
      return false;
    }
  };

  return { busy, error, run };
}
