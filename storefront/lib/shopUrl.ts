// The filters that can appear in the address: /shop?category=stationery&search=pen&page=2
export type Filters = { category?: string; search?: string; page?: string };

// Builds a /shop address from filters, so every chip and page link keeps the other filters
export const shopHref = (f: Filters): string => {
  const q = new URLSearchParams(); // collects the parts after the "?"
  if (f.category) q.set("category", f.category);
  if (f.search) q.set("search", f.search);
  if (f.page && f.page !== "1") q.set("page", f.page); // page 1 needs no "page=" in the address
  const text = q.toString();
  return text ? `/shop?${text}` : "/shop";
};
