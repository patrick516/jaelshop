import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import ActivityPage from "@/features/activity/ActivityPage";
import AuthProvider from "@/features/auth/AuthProvider";
import LoginPage from "@/features/auth/LoginPage";
import BrandsPage from "@/features/brands/BrandsPage";
import CategoriesPage from "@/features/categories/CategoriesPage";
import CustomersPage from "@/features/customers/CustomersPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import InventoryPage from "@/features/inventory/InventoryPage";
import MarketingPage from "@/features/marketing/MarketingPage";
import OrdersPage from "@/features/orders/OrdersPage";
import PaymentsPage from "@/features/payments/PaymentsPage";
import ProductsPage from "@/features/products/ProductsPage";
import ReportsPage from "@/features/reports/ReportsPage";
import SettingsPage from "@/features/settings/SettingsPage";
import StaffPage from "@/features/staff/StaffPage";
import AdminLayout from "@/layouts/AdminLayout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* Everything inside needs a login and gets the sidebar and top bar */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="brands" element={<BrandsPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="marketing" element={<MarketingPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="staff" element={<StaffPage />} />
              <Route path="activity-logs" element={<ActivityPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
