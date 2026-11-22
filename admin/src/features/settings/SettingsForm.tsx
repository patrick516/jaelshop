import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Field from "@/components/shared/Field";
import FormCard from "@/components/shared/FormCard";
import { useSubmit } from "@/hooks/useSubmit";
import { api } from "@/lib/api";
import type { Settings } from "@/types";
import { Pencil, Save, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

// Helper to fix any bad data coming from the database
const cleanPhone = (val: string | undefined | null) => {
  if (!val) return "";
  let digits = val.replace(/\D/g, ""); // Keep only digits
  if (digits.startsWith("265")) digits = digits.substring(3); // Remove first 265
  if (digits.startsWith("0")) digits = digits.substring(1); // Remove leading 0
  digits = digits.slice(0, 9); // Keep max 9 digits
  return `+265${digits}`;
};

export default function SettingsForm({ initial }: { initial: Settings }) {
  // SANITIZE THE INITIAL DATA ON LOAD
  const [v, setV] = useState<Settings>({
    ...initial,
    whatsappNumber: cleanPhone(initial.whatsappNumber),
    airtelMoneyNumber: cleanPhone(initial.airtelMoneyNumber),
    tnmMpambaNumber: cleanPhone(initial.tnmMpambaNumber),
  });

  const { busy, error, run } = useSubmit();
  const [isEditing, setIsEditing] = useState(false);

  const set = (key: keyof Settings) => (e: ChangeEvent<HTMLInputElement>) =>
    setV({ ...v, [key]: e.target.value });

  // THE STRICT PHONE HANDLER (Same as before)
  const setPhone =
    (key: keyof Settings) => (e: ChangeEvent<HTMLInputElement>) => {
      let rawValue = e.target.value;

      if (!rawValue || rawValue === "+") {
        setV({ ...v, [key]: "" });
        return;
      }

      let digits = rawValue.replace(/\D/g, "");
      if (digits.startsWith("265")) digits = digits.substring(3);
      if (digits.startsWith("0")) digits = digits.substring(1);
      digits = digits.slice(0, 9);

      setV({ ...v, [key]: `+265${digits}` });
    };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      storeName: v.storeName.trim(),
      whatsappNumber: v.whatsappNumber.trim(),
      airtelMoneyNumber: v.airtelMoneyNumber.trim(),
      tnmMpambaNumber: v.tnmMpambaNumber.trim(),
      pendingAlertHours: v.pendingAlertHours.trim(),
    };

    await run(async () => {
      await api.put("/settings", body);
      setIsEditing(false);
      return { success: true };
    }, "Settings saved");
  };

  const handleCancel = () => {
    // Reset to the sanitized initial data
    setV({
      ...initial,
      whatsappNumber: cleanPhone(initial.whatsappNumber),
      airtelMoneyNumber: cleanPhone(initial.airtelMoneyNumber),
      tnmMpambaNumber: cleanPhone(initial.tnmMpambaNumber),
    });
    setIsEditing(false);
  };

  // ==========================================
  // VIEW MODE (Read-only Table)
  // ==========================================
  if (!isEditing) {
    return (
      <div className="w-full max-w-4xl overflow-hidden rounded-xl border bg-white shadow-sm animate-in fade-in duration-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600 w-1/3">
                Setting
              </th>
              <th className="px-6 py-4 font-semibold text-slate-600">Value</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-right w-24">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-4 font-medium text-slate-900">
                Shop Name
              </td>
              <td className="px-6 py-4 text-slate-600">{v.storeName || "—"}</td>
              <td className="px-6 py-4 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Pencil size={14} /> Edit
                </Button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-4 font-medium text-slate-900">
                WhatsApp Number
              </td>
              <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                <FaWhatsapp className="text-green-500 text-lg" />
                {v.whatsappNumber || "—"}
              </td>
              <td className="px-6 py-4 text-right"></td>
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-4 font-medium text-slate-900">
                Airtel Money
              </td>
              <td className="px-6 py-4 text-slate-600">
                {v.airtelMoneyNumber || "—"}
              </td>
              <td className="px-6 py-4 text-right"></td>
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-4 font-medium text-slate-900">
                TNM Mpamba
              </td>
              <td className="px-6 py-4 text-slate-600">
                {v.tnmMpambaNumber || "—"}
              </td>
              <td className="px-6 py-4 text-right"></td>
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-4 font-medium text-slate-900">
                Pending Alert Hours
              </td>
              <td className="px-6 py-4 text-slate-600">
                {v.pendingAlertHours ? `${v.pendingAlertHours} hours` : "—"}
              </td>
              <td className="px-6 py-4 text-right"></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // ==========================================
  // EDIT MODE (Form)
  // ==========================================
  return (
    <form
      onSubmit={submit}
      className="max-w-2xl space-y-5 animate-in fade-in duration-200"
    >
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
          hint="Orders and the website chat buttons go to this number. Start typing with +265."
        >
          <div className="relative">
            <FaWhatsapp className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
            <Input
              id="s-wa"
              type="tel"
              placeholder="+265995049331"
              className="pl-10"
              value={v.whatsappNumber}
              onChange={setPhone("whatsappNumber")}
              maxLength={13}
            />
          </div>
        </Field>
      </FormCard>

      <FormCard title="Mobile money numbers (optional)">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Airtel Money" htmlFor="s-airtel">
            <Input
              id="s-airtel"
              type="tel"
              placeholder="+265995049331"
              value={v.airtelMoneyNumber}
              onChange={setPhone("airtelMoneyNumber")}
              maxLength={13}
            />
          </Field>
          <Field label="TNM Mpamba" htmlFor="s-tnm">
            <Input
              id="s-tnm"
              type="tel"
              placeholder="+265995049331"
              value={v.tnmMpambaNumber}
              onChange={setPhone("tnmMpambaNumber")}
              maxLength={13}
            />
          </Field>
        </div>
      </FormCard>

      <FormCard title="Pending order alert">
        <Field
          label="Warn me after (hours)"
          htmlFor="s-stale"
          hint="A WhatsApp order that is still pending after this many hours shows in the dashboard alert. e.g. 24."
        >
          <Input
            id="s-stale"
            type="number"
            min="1"
            step="1"
            value={v.pendingAlertHours}
            onChange={set("pendingAlertHours")}
          />
        </Field>
      </FormCard>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button
          disabled={busy}
          className="bg-orange-500 hover:bg-orange-600 gap-2"
        >
          <Save size={16} /> {busy ? "Saving..." : "Save settings"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={busy}
          className="gap-2"
        >
          <X size={16} /> Cancel
        </Button>
      </div>
    </form>
  );
}
