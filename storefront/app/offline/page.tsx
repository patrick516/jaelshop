import { WifiOff } from "lucide-react";

export const metadata = { title: "You are offline" };

// Shown when the phone has no signal. The service worker keeps a copy of this page
export default function OfflinePage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 rounded-2xl border bg-white p-10 text-center">
      <WifiOff size={40} className="text-orange-500" />
      <h1 className="text-xl font-extrabold text-navy">You are offline</h1>
      <p className="text-sm text-muted-foreground">Check your connection, then try again. Your cart is saved on this phone.</p>
      {/* a plain link on purpose: it must ask the server again */}
      <a href="/" className="mt-2 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-white">
        Try again
      </a>
    </div>
  );
}
