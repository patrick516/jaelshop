import type { Category } from "./types";

// The fields are text while the staff member types
export type CategoryValues = { name: string; description: string; parentId: string; sortOrder: string; isActive: boolean };

// A saved category as form text. null gives an empty form for a new one
export const toValues = (c: Category | null): CategoryValues => ({
  name: c?.name ?? "",
  description: c?.description ?? "",
  parentId: c?.parentId ?? "",
  sortOrder: String(c?.sortOrder ?? 0),
  isActive: c?.isActive ?? true,
});

// The request body the backend expects
export const toPayload = (v: CategoryValues) => ({
  name: v.name.trim(),
  description: v.description.trim() || null,
  parentId: v.parentId || null,
  sortOrder: Number(v.sortOrder) || 0,
  isActive: v.isActive,
});
