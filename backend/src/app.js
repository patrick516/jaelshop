const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const env = require("./config/env");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./modules/auth/auth.routes");
const categoryRoutes = require("./modules/categories/categories.routes");
const brandRoutes = require("./modules/brands/brands.routes");
const supplierRoutes = require("./modules/suppliers/suppliers.routes");
const productRoutes = require("./modules/products/products.routes");
const orderRoutes = require("./modules/orders/orders.routes");
const paymentRoutes = require("./modules/payments/payments.routes");
const settingsRoutes = require("./modules/settings/settings.routes");
const customerRoutes = require("./modules/customers/customers.routes");
const inventoryRoutes = require("./modules/inventory/inventory.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");
const staffRoutes = require("./modules/staff/staff.routes");
const reportRoutes = require("./modules/reports/reports.routes");
const { logActivity } = require("./utils/activityLog");
const uploadRoutes = require("./modules/uploads/uploads.routes");
const couponRoutes = require("./modules/coupons/coupons.routes");
const productImageRoutes = require("./modules/products/productImages.routes");
const productStockRoutes = require("./modules/products/products.stock.routes");

const app = express();

// ✅ FIX: Tell Express to trust Render's proxy (1 hop)
app.set("trust proxy", 1);

app.use(helmet());

app.use(cors({ origin: env.corsOrigins, credentials: true }));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "JAEL API is running" });
});

// Feature routes (auth, products, orders...) will be added here as we build them
app.use("/api/auth", authRoutes);
app.use("/api", logActivity);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productStockRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products", productImageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/coupons", couponRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
