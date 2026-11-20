import { useEffect, useState } from "react";
import { api } from "@/lib/api";

// How many orders are waiting (status PENDING). Refreshes every minute
export function usePendingOrders() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let alive = true; // stops a late answer updating a screen that has gone
    const load = () =>
      api
        .get<unknown[]>("/orders", { status: "PENDING", limit: 1 }) // limit 1: we only need the total
        .then((res) => alive && setCount(res.pagination?.total ?? 0))
        .catch(() => {}); // a failed refresh just keeps the old number

    load();
    const timer = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  return count;
}
