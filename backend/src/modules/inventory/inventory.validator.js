const { body, param } = require("express-validator");
const { handleValidation } = require("../../validators/common.validator");

// Checks :productId or :variantId in the URL is a real UUID
const uuidParam = (name) => [
  param(name).isUUID().withMessage(`Invalid ${name}`),
  handleValidation,
];

// Shared variant fields, all optional
const variantFields = [
  body("sku").optional().trim().notEmpty().withMessage("SKU cannot be empty"),
  body("size").optional({ nullable: true }).trim(),
  body("color").optional({ nullable: true }).trim(),
  body("priceOverride")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("Variant price must be a number"),
];

// New variant also takes opening stock and the low stock warning level
const variantCreateRules = [
  ...variantFields,
  body("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantity must be 0 or more"),
  body("lowStockThreshold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Threshold must be 0 or more"),
  handleValidation,
];

const variantUpdateRules = [
  ...variantFields,
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
  handleValidation,
];

// quantity: positive adds stock, negative removes it. SALE is not allowed here, orders make those
const adjustRules = [
  body("quantity")
    .isInt()
    .withMessage("Quantity must be a whole number")
    .custom((v) => Number(v) !== 0)
    .withMessage("Quantity cannot be 0"),
  body("type")
    .optional()
    .isIn(["PURCHASE", "ADJUSTMENT", "RETURN"])
    .withMessage("Invalid type"),
  body("note").optional({ nullable: true }).trim(),
  handleValidation,
];

module.exports = {
  uuidParam,
  variantCreateRules,
  variantUpdateRules,
  adjustRules,
};
