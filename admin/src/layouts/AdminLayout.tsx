import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useNewOrders } from "@/features/orders/useNewOrders";
import { usePendingOrders } from "@/features/orders/usePendingOrders";
import FloatingChat from "./FloatingChat";
import SidebarContent from "./SidebarContent";
import Topbar from "./Topbar";

// The frame around every admin page: sidebar, top bar and the page itself
export default function AdminLayout() {
  const [open, setOpen] = useState(false); // the phone menu
  const pending = usePendingOrders(); // orders still waiting for action (the sidebar number)
  const onOrders = useLocation().pathname.startsWith("/orders");
  const { count: newOrders, markSeen } = useNewOrders(onOrders); // orders you have not looked at yet (the bell)

  return (
    <div className="min-h-screen">
      {/* Desktop: a fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <SidebarContent pending={pending} />
      </aside>

      {/* Phone: the same sidebar slides in from the left */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" aria-describedby={undefined} className="w-64 border-0 bg-navy p-0 text-white [&>button]:text-white">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SidebarContent pending={pending} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <Topbar newOrders={newOrders} onBell={markSeen} onMenu={() => setOpen(true)} />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      <FloatingChat />
    </div>
  );
}
