import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/shared/PageHeader";
import { useAuth } from "@/features/auth/useAuth";
import { useFetch } from "@/hooks/useFetch";
import KpiCards from "./KpiCards";
import QuickActions from "./QuickActions";
import RangeTabs from "./RangeTabs";
import RecentOrders from "./RecentOrders";
import SalesChart from "./SalesChart";
import TopCategories from "./TopCategories";
import type { DashboardData } from "./types";

// Only puts the dashboard together
export default function DashboardPage() {
  const { user } = useAuth();
  const [days, setDays] = useState(30);
  const { data, error } = useFetch<DashboardData>(`/dashboard?days=${days}`);

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle={`Welcome back, ${user?.firstName}! Here's what's happening with your store.`}>
        <RangeTabs days={days} onChange={setDays} />
      </PageHeader>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p>}
      {!data && !error && <Skeleton className="h-96 w-full" />}
      {data && (
        <>
          {data.lowStockCount > 0 && (
            <Link to="/inventory?lowStock=true" className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">
              <AlertTriangle size={18} /> {data.lowStockCount} {data.lowStockCount === 1 ? "item is" : "items are"} low on stock. Tap to see them.
            </Link>
          )}
          <KpiCards data={data} />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SalesChart points={data.salesOverview} monthly={days > 90} />
            </div>
            <TopCategories categories={data.topCategories} />
            <div className="lg:col-span-2">
              <RecentOrders orders={data.recentOrders} />
            </div>
            <QuickActions />
          </div>
        </>
      )}
    </div>
  );
}
