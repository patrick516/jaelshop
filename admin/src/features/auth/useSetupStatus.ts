import { useEffect, useState } from "react";
import { api } from "@/lib/api";

// Asks the server whether there are no staff accounts yet (so the first-time setup page must be shown)
export function useSetupStatus() {
  const [state, setState] = useState({ loading: true, needsSetup: false });

  useEffect(() => {
    let alive = true; // stops a late answer updating a screen that has gone
    api
      .get<{ needsSetup: boolean }>("/auth/setup-status")
      .then((res) => alive && setState({ loading: false, needsSetup: res.data.needsSetup }))
      .catch(() => alive && setState({ loading: false, needsSetup: false })); // server down: show the login, which will say so
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
