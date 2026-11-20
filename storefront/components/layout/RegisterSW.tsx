"use client"; // registers the service worker in the browser

import { useEffect } from "react";

// Only in the real (built) shop. While developing, a service worker would only get in the way
export default function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {}); // the shop works fine without it
  }, []);

  return null;
}
