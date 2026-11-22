import type { ReactNode } from "react";
import { ShoppingBag } from "lucide-react";

type Props = { title: string; subtitle: string; children: ReactNode };

// The light page with a floating logo and a white card, matching the login page
export default function AuthCard({ title, subtitle, children }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] p-4 font-sans">
      <div className="mb-8 flex max-w-md flex-col items-center text-center">
        <ShoppingBag className="mb-4 h-10 w-10 text-orange-500" />
        <h1 className="text-3xl font-bold text-[#0F172A]">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="w-full max-w-[460px] rounded-2xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">{children}</div>
      <p className="mt-12 text-xs text-slate-400">© {new Date().getFullYear()} JAEL ENTERPRISE. All rights reserved.</p>
    </div>
  );
}
