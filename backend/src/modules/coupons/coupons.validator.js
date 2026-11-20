const { body } = require("express-validator");
const { handleValidation } = require("../../validators/common.validator");

// Rules shared by create and update. "required" decides if a field must be sent
const fields = (required) => {
  const field = (name) => (required ? body(name) : body(name).optional());
  return [
    field("code")
      .trim()
      .matches(/^[A-Za-z0-9_-]{3,20}$/)
      .withMessage("Code must be 3 to 20 letters or numbers, e.g. WELCOME10"),
    field("discountType")
      .isIn(["PERCENTAGE", "FIXED"])
      .withMessage("Choose percentage or fixed amount"),
    field("discountValue")
      .isFloat({ gt: 0 })
      .withMessage("Discount must be more than 0")
      .custom((v, { req }) => req.body.discountType !== "PERCENTAGE" || Number(v) <= 100)
      .withMessage("A percentage cannot be more than 100"),
    body("minOrderAmount")
      .optional({ nullable: true })
      .isFloat({ min: 0 })
      .withMessage("Minimum order must be a number"),
    body("maxUses")
      .optional({ nullable: true })
      .isInt({ min: 1 })
      .withMessage("Maximum uses must be 1 or more"),
    body("startsAt").optional({ nullable: true }).isISO8601().withMessage("Invalid start date"),
    body("expiresAt")
      .optional({ nullable: true })
      .isISO8601()
      .withMessage("Invalid end date")
      .custom((v, { req }) => !v || !req.body.startsAt || new Date(v) > new Date(req.body.startsAt))
      .withMessage("The end date must be after the start date"),
    body("isActive").optional().isBoolean().withMessage("isActive must be true or false"),
  ];
};

const createRules = [...fields(true), handleValidation];
const updateRules = [...fields(false), handleValidation];

// The storefront checks a code against the cart
const checkRules = [
  body("code").trim().notEmpty().withMessage("Enter a code"),
  body("items").isArray({ min: 1 }).withMessage("Your cart is empty"),
  body("items.*.variantId").isUUID().withMessage("Invalid variant id"),
  body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  handleValidation,
];

module.exports = { createRules, updateRules, checkRules };
