// Click-to-chat link. number is digits only with country code (265999123456), text is optional
export const whatsappLink = (number: string, text = ""): string =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`; // encodeURIComponent makes the text safe for a URL
