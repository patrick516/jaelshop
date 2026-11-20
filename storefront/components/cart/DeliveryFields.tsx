import type { CheckoutFields, SetField } from "@/hooks/useCheckout";
import { field } from "@/lib/styles";

// The delivery details part of the checkout form
export default function DeliveryFields({ form, set }: { form: CheckoutFields; set: SetField }) {
  return (
    <section className="space-y-3">
      <h2 className="font-extrabold text-navy">Delivery details</h2>
      <input required value={form.name} onChange={set("name")} placeholder="Full name" className={field} />
      <input required type="tel" value={form.phone} onChange={set("phone")} placeholder="Phone number" className={field} />
      <div className="grid grid-cols-2 gap-3">
        <input required value={form.district} onChange={set("district")} placeholder="District (e.g. Blantyre)" className={field} />
        <input required value={form.area} onChange={set("area")} placeholder="Area (e.g. Chilomoni)" className={field} />
      </div>
      <input value={form.address} onChange={set("address")} placeholder="Street or landmark (optional)" className={field} />
      <textarea value={form.notes} onChange={set("notes")} rows={2} placeholder="Notes for delivery (optional)" className={field} />
    </section>
  );
}
