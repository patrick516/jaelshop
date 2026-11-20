import { getSettings } from "@/services/catalog";
import OrderConfirmation from "@/components/cart/OrderConfirmation";

export default async function OrderConfirmationPage() {
  const settings = await getSettings();
  return <OrderConfirmation settings={settings} />;
}
