// Names shown in WhatsApp messages
const METHODS = {
  AIRTEL_MONEY: "Airtel Money",
  TNM_MPAMBA: "TNM Mpamba",
  CASH_ON_DELIVERY: "Cash on Delivery",
  BANK_TRANSFER: "Bank Transfer",
};

// Turns 0999123456 or +265 999 123 456 into 265999123456 (wa.me needs digits only, with country code)
const normalizePhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, ""); // remove everything that is not a digit
  return digits.startsWith("0") ? `265${digits.slice(1)}` : digits; // local 0... becomes 265...
};

// Click-to-chat link: opens WhatsApp to that number with the text already typed
const buildLink = (phone, text) =>
  `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;

// Money as text, e.g. MK 15,500
const mk = (n) => `MK ${Number(n).toLocaleString("en-US")}`;

// The message the customer sends to the OWNER when ordering
const orderMessage = (order, storeName) => {
  // One line per item, e.g. "2 x A4 Notebook (A4 / Blue) - MK 3,000"
  const lines = order.items.map(
    (i) =>
      `${i.quantity} x ${i.productName}${i.variantLabel ? ` (${i.variantLabel})` : ""} - ${mk(i.lineTotal)}`,
  );
  const where = [
    order.shippingAddress,
    order.shippingArea,
    order.shippingDistrict,
  ]
    .filter(Boolean)
    .join(", ");
  return [
    `*New order ${order.orderNumber}* - ${storeName}`, // *text* is bold in WhatsApp
    "",
    ...lines,
    "",
    `Subtotal: ${mk(order.subtotal)}`,
    `Delivery: ${mk(order.deliveryFee)}`,
    ...(Number(order.discountTotal) > 0 ? [`Discount: -${mk(order.discountTotal)}`] : []),
    `*Total: ${mk(order.total)}*`,
    "",
    `Name: ${order.shippingName}`,
    `Phone: ${order.shippingPhone}`,
    `Deliver to: ${where}`,
    `Payment: ${METHODS[order.payments[0].method]}`,
    ...(order.notes ? [`Notes: ${order.notes}`] : []), // only when the customer wrote notes
  ].join("\n"); // one item per line
};

// The message STAFF send to the CUSTOMER about their order
const customerMessage = (order, storeName) =>
  `Hello ${order.shippingName}, your order ${order.orderNumber} (${mk(order.total)}) is now ${order.status.toLowerCase()}. Thank you for shopping with ${storeName}.`;

module.exports = { normalizePhone, buildLink, orderMessage, customerMessage };
