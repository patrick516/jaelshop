import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { daysAgo, today } from "@/lib/dates";
import DateRange from "./DateRange";
import PaymentsReport from "./PaymentsReport";
import ProfitReport from "./ProfitReport";
import SalesReport from "./SalesReport";
import StockReport from "./StockReport";
import TopProductsReport from "./TopProductsReport";

// Sales, best sellers, payments and stock value. The date boxes apply to the first three
export default function ReportsPage() {
  const [tab, setTab] = useState("sales");
  const [range, setRange] = useState({ from: daysAgo(30), to: today() });

  return (
    <>
      <PageHeader title="Reports" subtitle="See how the shop is doing." />
      {tab !== "stock" && (
        <DateRange
          from={range.from}
          to={range.to}
          onChange={(from, to) => setRange({ from, to })}
        />
      )}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 h-auto flex-wrap justify-start">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="profit">Profit</TabsTrigger>
          <TabsTrigger value="top">Best sellers</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="stock">Stock value</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <SalesReport {...range} />
        </TabsContent>
        <TabsContent value="profit">
          <ProfitReport {...range} />
        </TabsContent>
        <TabsContent value="top">
          <TopProductsReport {...range} />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentsReport {...range} />
        </TabsContent>
        <TabsContent value="stock">
          <StockReport />
        </TabsContent>
      </Tabs>
    </>
  );
}
