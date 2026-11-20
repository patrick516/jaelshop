import { getSettings } from "@/services/catalog";
import CheckoutForm from "@/components/cart/CheckoutForm";

export default async function CheckoutPage() {
  const settings = await getSettings();
  return <CheckoutForm settings={settings} />;
}
