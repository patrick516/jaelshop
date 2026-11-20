import { ShoppingBag } from "lucide-react";
import SidebarNav from "./SidebarNav";

type Props = { pending: number; onNavigate?: () => void };

// Everything inside the sidebar. Used on desktop and in the phone slide-out menu
export default function SidebarContent({ pending, onNavigate }: Props) {
  return (
    <div className="flex h-full flex-col gap-4 bg-navy py-5">
      <div className="flex items-center gap-3 px-5 pb-2 text-white">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500">
          <ShoppingBag size={24} />
        </span>
        <div className="leading-tight">
          <p className="text-lg font-extrabold">JAEL</p>
          <p className="text-sm font-extrabold">ENTERPRISE</p>
        </div>
      </div>
      <SidebarNav pending={pending} onNavigate={onNavigate} />
      <p className="flex justify-between px-5 text-xs text-white/60">
        <span>© 2026 JAEL ENTERPRISE</span>
        <span>v1.0.0</span>
      </p>
    </div>
  );
}
