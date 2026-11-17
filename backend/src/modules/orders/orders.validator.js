const { body } = require("express-validator");
const { handleValidation } = require("../../validators/common.validator");

// Rules for placing an order
const createRules = [
  body("items").isArray({ min: 1 }).withMessage("Add at least one item"),
  body("items.*.variantId").isUUID().withMessage("Invalid variant id"), // * = every item in the list
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("shippingName").trim().notEmpty().withMessage("Name is required"),
  body("shippingPhone").trim().notEmpty().withMessage("Phone is required"),
  body("shippingDistrict")
    .trim()
    .notEmpty()
    .withMessage("District is required"),
  body("shippingArea").trim().notEmpty().withMessage("Area is required"),
  body("shippingAddress").optional({ nullable: true }).trim(),
  body("notes").optional({ nullable: true }).trim(),
  body("paymentMethod")
    .optional()
    .isIn(["AIRTEL_MONEY", "TNM_MPAMBA", "CASH_ON_DELIVERY", "BANK_TRANSFER"])
    .withMessage("Invalid payment method"),
  body("paymentPhone").optional({ nullable: true }).trim(),
  body("customerId")
    .optional({ nullable: true })
    .isUUID()
    .withMessage("Invalid customer id"),
  body("source")
    .optional()
    .isIn(["WEBSITE", "WHATSAPP", "ADMIN"])
    .withMessage("Invalid source"),
  handleValidation,
];

// Rules for changing an order's status
const statusRules = [
  body("status")
    .isIn([
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ])
    .withMessage("Invalid status"),
  handleValidation,
];

module.exports = { createRules, statusRules };
