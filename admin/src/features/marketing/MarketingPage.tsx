import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import PageHeader from "@/components/shared/PageHeader";
import { useDeleteDialog } from "@/hooks/useDeleteDialog";
import { useFetch } from "@/hooks/useFetch";
import CouponDialog from "./CouponDialog";
import CouponsTable from "./CouponsTable";
import type { Coupon } from "./types";

// Discount codes. Buyers type a code at checkout and the discount comes off the products
export default function MarketingPage() {
  const { data, error, loading, reload } = useFetch<Coupon[]>("/coupons");
  const [dialog, setDialog] = useState<{ coupon: Coupon | null } | null>(null); // null means closed
  const del = useDeleteDialog<Coupon>("/coupons", reload);

  return (
    <>
      <PageHeader title="Marketing" subtitle="Discount codes you can share on WhatsApp. Tap a code to copy it.">
        <Button onClick={() => setDialog({ coupon: null })} className="bg-orange-500 hover:bg-orange-600">
          <Plus size={18} className="mr-2" /> Add Code
        </Button>
      </PageHeader>

      {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">{error}</p> : <CouponsTable items={data ?? []} loading={loading} onEdit={(coupon) => setDialog({ coupon })} onDelete={del.ask} />}

      {dialog && (
        <CouponDialog
          coupon={dialog.coupon}
          onClose={() => setDialog(null)}
          onSaved={() => {
            setDialog(null);
            reload();
          }}
        />
      )}
      <ConfirmDialog
        open={!!del.target}
        title="Delete this code?"
        description={`"${del.target?.code}" will stop working. Orders that already used it keep their discount. To pause it instead, edit it and switch it off.`}
        confirmLabel="Delete"
        busy={del.busy}
        onConfirm={del.confirm}
        onCancel={del.cancel}
      />
    </>
  );
}
