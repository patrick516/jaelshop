"use client"; // uses browser events and storage

import { useEffect, useState } from "react";

// Chrome's "install app" event
type InstallEvent = Event & { prompt: () => Promise<void> };
const KEY = "jael-install-dismissed";

// Knows whether to offer installing: a one-tap prompt on Android, a how-to hint on iPhone
export function useInstallPrompt() {
  const [event, setEvent] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [hidden, setHidden] = useState(true); // hidden until we know, so the banner never flashes

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(KEY) === "1";
    } catch {}
    const installed = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent) && !installed);
    setHidden(dismissed || installed);

    const onPrompt = (e: Event) => {
      e.preventDefault(); // keep it for our own button
      setEvent(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const install = async () => {
    if (!event) return;
    await event.prompt();
    setEvent(null);
  };

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
  };

  return { canInstall: !hidden && !!event, showIosHint: !hidden && ios, install, dismiss };
}
