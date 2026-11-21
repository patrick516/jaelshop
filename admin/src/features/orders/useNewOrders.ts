import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

const KEY = "jael-admin-orders-seen"; // the time of the newest order staff have looked at, saved on this device

const read = (): number | null => {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? Number(saved) : null;
  } catch {
    return null;
  }
};
const write = (time: number) => {
  try {
    localStorage.setItem(KEY, String(time));
  } catch {
    // storage blocked: the bell then starts from zero on every visit
  }
};

// How many orders arrived since staff last looked. watching is true while the Orders page is open,
// and then everything counts as seen. markSeen() clears the bell, e.g. when it is clicked
export function useNewOrders(watching: boolean) {
  const [count, setCount] = useState(0);
  const newest = useRef(0); // time of the newest order loaded so far, from the server's clock

  useEffect(() => {
    let alive = true;
    const load = () =>
      api
        .get<{ createdAt: string }[]>("/orders", { limit: 20 })
        .then((res) => {
          if (!alive) return;
          const times = res.data.map((o) => new Date(o.createdAt).getTime());
          newest.current = Math.max(0, ...times);
          const seen = read();
          if (watching || seen === null) {
            write(newest.current); // the first visit also starts from "nothing new"
            setCount(0);
            return;
          }
          setCount(times.filter((t) => t > seen).length);
        })
        .catch(() => {}); // a failed refresh keeps the old number
    load();
    const timer = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [watching]);

  const markSeen = useCallback(() => {
    write(newest.current);
    setCount(0);
  }, []);

  return { count, markSeen };
}
