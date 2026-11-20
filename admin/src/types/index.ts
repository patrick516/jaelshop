// Every backend answer has this shape
export type Pagination = { page: number; limit: number; total: number; totalPages: number };
export type ApiResponse<T> = { success: boolean; message: string; data: T; pagination?: Pagination };

// The logged-in staff member, as returned by /auth/staff/login
export type StaffUser = { id: string; firstName: string; lastName: string; email: string; role: string };
export type Session = { token: string; user: StaffUser };

// Shop settings the owner edits in the Settings page
export type Settings = { storeName: string; whatsappNumber: string; deliveryFee: string; airtelMoneyNumber: string; tnmMpambaNumber: string };
