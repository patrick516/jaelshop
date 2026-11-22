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
  body("couponCode").optional({ values: "falsy" }).trim(),
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

// Staff links an order to a customer, or sends null to remove the link
const customerRules = [
  body("customerId")
    .optional({ nullable: true })
    .isUUID()
    .withMessage("Invalid customer id"),
  handleValidation,
];

// Rules for marking an order as sold. Everything is optional, an empty body sells it at its current total, fully paid
const sellRules = [
  body("agreedTotal")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Agreed total must be more than 0"),
  body("amountPaid")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Amount paid cannot be negative"),
  body("method")
    .optional()
    .isIn(["AIRTEL_MONEY", "TNM_MPAMBA", "CASH_ON_DELIVERY", "BANK_TRANSFER"])
    .withMessage("Invalid payment method"),
  body("phoneNumber").optional({ nullable: true }).trim(),
  body("transactionRef").optional({ nullable: true }).trim(),
  handleValidation,
];

module.exports = { createRules, statusRules, customerRules, sellRules };
