const express = require("express");
const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const { sendSuccess } = require("../../utils/ApiResponse");

const router = express.Router();
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Public: the cart asks "how many are really left of these?"  GET /api/products/stock?ids=a,b,c
// Answers { variantId: quantity }. A hidden, archived or missing version counts as 0
router.get("/stock", async (req, res, next) => {
  try {
    const ids = [...new Set(String(req.query.ids || "").split(",").filter(Boolean))];
    if (ids.length === 0 || ids.length > 50 || !ids.every((id) => UUID.test(id))) {
      throw new ApiError(400, "Send between 1 and 50 valid version ids");
    }
    const rows = await prisma.productVariant.findMany({
      where: { id: { in: ids } },
      select: { id: true, isActive: true, inventory: { select: { quantity: true } }, product: { select: { status: true } } },
    });
    const stock = Object.fromEntries(ids.map((id) => [id, 0]));
    rows.forEach((v) => {
      stock[v.id] = v.isActive && v.product.status === "ACTIVE" ? (v.inventory?.quantity ?? 0) : 0;
    });
    sendSuccess(res, stock);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
