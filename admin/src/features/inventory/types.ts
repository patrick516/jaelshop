// One row of the inventory table: one size/colour version of a product
export type StockRow = {
  variantId: string;
  productId: string;
  productName: string;
  sku: string;
  size: string | null;
  color: string | null;
  isActive: boolean;
  quantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
};

export type Movement = { id: string; type: string; quantity: number; note: string | null; createdAt: string; user: { firstName: string; lastName: string } | null };

// "A4 / Blue", or "Default" for a product with no sizes or colours
export const versionLabel = (r: Pick<StockRow, "size" | "color">): string => [r.size, r.color].filter(Boolean).join(" / ") || "Default";

export const MOVEMENT_LABEL: Record<string, string> = { PURCHASE: "Stock added", SALE: "Sale", ADJUSTMENT: "Adjustment", RETURN: "Return" };
