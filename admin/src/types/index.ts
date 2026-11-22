// Every backend answer has this shape
export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
};

export type StaffUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
};
export type Session = { token: string; user: StaffUser };

// Shop settings the owner edits in the Settings page
export type Settings = {
  storeName: string;
  whatsappNumber: string;
  airtelMoneyNumber: string;
  tnmMpambaNumber: string;
  pendingAlertHours: string;
};
