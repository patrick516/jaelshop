export type LogRow = {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: { method?: string; path?: string } | null;
  ipAddress: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string } | null;
};

export const ACTION_LABEL: Record<string, string> = { CREATE: "Created", UPDATE: "Updated", DELETE: "Deleted" };

// The parts of the system a change can be filtered by
export const ENTITY_OPTIONS = ["products", "categories", "brands", "orders", "payments", "inventory", "settings", "staff", "customers", "suppliers"].map((e) => ({ value: e, label: e.charAt(0).toUpperCase() + e.slice(1) }));
