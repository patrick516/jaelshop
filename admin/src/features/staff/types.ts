import type { Opt } from "@/components/shared/OptionSelect";

export type StaffStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type StaffMember = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: StaffStatus;
  lastLoginAt: string | null;
  role: { id: string; name: string };
};

export type Role = { id: string; name: string; description: string | null; permissions: string[]; _count: { users: number } };

export const STAFF_STATUS_OPTIONS: Opt[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
];

// The areas a role can be given. "*" (everything) belongs to the Administrator role only
export const PERMISSIONS = [
  { key: "products", label: "Products" },
  { key: "categories", label: "Categories and brands" },
  { key: "orders", label: "Orders" },
  { key: "payments", label: "Payments" },
  { key: "inventory", label: "Inventory" },
  { key: "customers", label: "Customers" },
  { key: "reports", label: "Reports" },
  { key: "settings", label: "Settings" },
  { key: "staff", label: "Staff users" },
];

// The backend protects this role, because the admin permission checks depend on its name
export const isProtected = (r: Role): boolean => r.name === "Administrator";
