import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Field from "@/components/shared/Field";
import FormDialog from "@/components/shared/FormDialog";
import OptionSelect from "@/components/shared/OptionSelect";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";
import { toPayload, toValues, type CouponValues } from "./couponForm";
import type { Coupon, DiscountType } from "./types";

const TYPES = [
  { value: "PERCENTAGE", label: "Percentage (%)" },
  { value: "FIXED", label: "Fixed amount (MK)" },
];

type Props = { coupon: Coupon | null; onClose: () => void; onSaved: () => void };

// Add a discount code (coupon is null) or edit one
export default function CouponDialog({ coupon, onClose, onSaved }: Props) {
  const [v, setV] = useState<CouponValues>(() => toValues(coupon));
  const { busy, error, run } = useSubmit();
  const set = <K extends keyof CouponValues>(key: K, value: CouponValues[K]) => setV((x) => ({ ...x, [key]: value }));
  const percent = v.discountType === "PERCENTAGE";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const request = () => (coupon ? api.put(`/coupons/${coupon.id}`, toPayload(v)) : api.post("/coupons", toPayload(v)));
    if (await run(request, coupon ? "Code updated" : "Code created")) onSaved();
  };

  return (
    <FormDialog title={coupon ? "Edit discount code" : "Add discount code"} busy={busy} error={error} onClose={onClose} onSubmit={submit}>
      <Field label="Code" htmlFor="cp-code" hint="What the buyer types, e.g. WELCOME10. Capital letters are added for you.">
        <Input id="cp-code" required className="uppercase" value={v.code} onChange={(e) => set("code", e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Type">
          <OptionSelect value={v.discountType} onChange={(t) => set("discountType", t as DiscountType)} options={TYPES} placeholder="Type" />
        </Field>
        <Field label={percent ? "Percent off" : "Amount off (MWK)"} htmlFor="cp-value">
          <Input id="cp-value" type="number" required min={0.01} max={percent ? 100 : undefined} step="any" value={v.discountValue} onChange={(e) => set("discountValue", e.target.value)} />
        </Field>
        <Field label="Minimum order (optional)" htmlFor="cp-min" hint="Spend at least this much.">
          <Input id="cp-min" type="number" min={0} step="any" value={v.minOrderAmount} onChange={(e) => set("minOrderAmount", e.target.value)} />
        </Field>
        <Field label="Maximum uses (optional)" htmlFor="cp-max" hint="Empty means unlimited.">
          <Input id="cp-max" type="number" min={1} step={1} value={v.maxUses} onChange={(e) => set("maxUses", e.target.value)} />
        </Field>
        <Field label="Starts (optional)" htmlFor="cp-start">
          <Input id="cp-start" type="date" value={v.startsAt} onChange={(e) => set("startsAt", e.target.value)} />
        </Field>
        <Field label="Ends (optional)" htmlFor="cp-end" hint="The code works until the end of this day.">
          <Input id="cp-end" type="date" min={v.startsAt || undefined} value={v.expiresAt} onChange={(e) => set("expiresAt", e.target.value)} />
        </Field>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="cp-active" checked={v.isActive} onCheckedChange={(on) => set("isActive", on)} />
        <label htmlFor="cp-active" className="text-sm font-medium">
          Code is switched on
        </label>
      </div>
    </FormDialog>
  );
}
