const express = require("express");
const controller = require("./inventory.controller");
const {
  uuidParam,
  variantCreateRules,
  variantUpdateRules,
  adjustRules,
} = require("./inventory.validator");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");

const router = express.Router();

router.use(authenticate, authorize()); // staff only for every inventory route

router.get("/", controller.list);
router.post(
  "/products/:productId/variants",
  uuidParam("productId"),
  variantCreateRules,
  controller.addVariant,
);
router.put(
  "/variants/:variantId",
  uuidParam("variantId"),
  variantUpdateRules,
  controller.updateVariant,
);
router.post(
  "/variants/:variantId/adjust",
  uuidParam("variantId"),
  adjustRules,
  controller.adjust,
);
router.get(
  "/variants/:variantId/movements",
  uuidParam("variantId"),
  controller.movements,
);

module.exports = router;
