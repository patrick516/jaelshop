"use client"; // buttons and browser events

import { Download, Share, X } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

// A small banner above the bottom menu, on phones only
export default function InstallPrompt() {
  const { canInstall, showIosHint, install, dismiss } = useInstallPrompt();
  if (!canInstall && !showIosHint) return null;

  return (
    <div className="fixed inset-x-3 bottom-20 z-30 flex items-center gap-3 rounded-xl bg-navy p-3 text-sm text-white shadow-lg md:hidden">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500">
        <Download size={20} />
      </span>
      <p className="flex-1">
        {canInstall ? (
          "Install JAEL on your phone for faster shopping."
        ) : (
          <>
            Tap <Share size={14} className="inline" /> then &quot;Add to Home Screen&quot; to install JAEL.
          </>
        )}
      </p>
      {canInstall && (
        <button onClick={install} className="rounded-full bg-orange-500 px-4 py-2 font-semibold">
          Install
        </button>
      )}
      <button onClick={dismiss} aria-label="Dismiss" className="flex h-8 w-8 items-center justify-center">
        <X size={18} />
      </button>
    </div>
  );
}
