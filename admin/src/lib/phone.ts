// 0999123456 or +265 999 123 456 becomes 265999123456 (what WhatsApp links need)
export const normalizePhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? `265${digits.slice(1)}` : digits;
};

// True when two numbers are the same person's, however they were typed
export const samePhone = (a?: string | null, b?: string | null): boolean => !!a && !!b && normalizePhone(a) === normalizePhone(b);

// Click-to-chat link with the message already typed
export const whatsappLink = (phone: string, text: string): string => `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;
