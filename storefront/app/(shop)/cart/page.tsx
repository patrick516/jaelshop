import { getSettings } from "@/services/catalog";
import CartView from "@/components/cart/CartView";

// Server component: fetches the delivery fee and WhatsApp number, the cart itself lives in the browser
export default async function CartPage() {
  const settings = await getSettings();
  return <CartView settings={settings} />;
}
