import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Field from "@/components/shared/Field";
import FormCard from "@/components/shared/FormCard";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";
import type { Settings } from "@/types";

// The shop settings form. Only an Administrator can save it
export default function SettingsForm({ initial }: { initial: Settings }) {
  const [v, setV] = useState<Settings>(initial);
  const { busy, error, run } = useSubmit();
  const set = (key: keyof Settings) => (e: ChangeEvent<HTMLInputElement>) =>
    setV({ ...v, [key]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      storeName: v.storeName.trim(),
      whatsappNumber: v.whatsappNumber.trim(),
      airtelMoneyNumber: v.airtelMoneyNumber.trim(),
      tnmMpambaNumber: v.tnmMpambaNumber.trim(),
    };
    await run(() => api.put("/settings", body), "Settings saved");
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <FormCard title="Shop details">
        <Field label="Shop name" htmlFor="s-name">
          <Input
            id="s-name"
            required
            value={v.storeName}
            onChange={set("storeName")}
          />
        </Field>
        <Field
          label="WhatsApp number"
          htmlFor="s-wa"
          hint="Orders and the website chat buttons go to this number. e.g. 0999123456 or +265999123456."
        >
          <Input
            id="s-wa"
            type="tel"
            value={v.whatsappNumber}
            onChange={set("whatsappNumber")}
          />
        </Field>
      </FormCard>

      <FormCard title="Mobile money numbers (optional)">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Airtel Money" htmlFor="s-airtel">
            <Input
              id="s-airtel"
              type="tel"
              value={v.airtelMoneyNumber}
              onChange={set("airtelMoneyNumber")}
            />
          </Field>
          <Field label="TNM Mpamba" htmlFor="s-tnm">
            <Input
              id="s-tnm"
              type="tel"
              value={v.tnmMpambaNumber}
              onChange={set("tnmMpambaNumber")}
            />
          </Field>
        </div>
      </FormCard>
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">
          {error}
        </p>
      )}
      <Button disabled={busy} className="bg-orange-500 hover:bg-orange-600">
        {busy ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
