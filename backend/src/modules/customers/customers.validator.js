const { body, param } = require("express-validator");
const { handleValidation } = require("../../validators/common.validator");

// Customer edits their own profile: every field optional, valid if sent
const profileRules = [
  body("firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty"),
  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be empty"),
  body("phone").optional({ nullable: true }).trim(),
  handleValidation,
];

// Address rules. required = true on create (core fields must be sent), false on update
const addressFields = (required) => {
  const field = (name) => (required ? body(name) : body(name).optional());
  return [
    field("fullName").trim().notEmpty().withMessage("Full name is required"),
    field("phone").trim().notEmpty().withMessage("Phone is required"),
    field("district").trim().notEmpty().withMessage("District is required"),
    field("area").trim().notEmpty().withMessage("Area is required"),
    body("label").optional({ nullable: true }).trim(),
    body("addressLine").optional({ nullable: true }).trim(),
    body("isDefault")
      .optional()
      .isBoolean()
      .withMessage("isDefault must be true or false"),
  ];
};

const addressCreateRules = [...addressFields(true), handleValidation];
const addressUpdateRules = [...addressFields(false), handleValidation];

// Staff blocks or unblocks a customer
const statusRules = [
  body("status")
    .isIn(["ACTIVE", "INACTIVE", "SUSPENDED"])
    .withMessage("Invalid status"),
  handleValidation,
];

// Checks :productId in the URL is a real UUID (wishlist routes)
const productIdParam = [
  param("productId").isUUID().withMessage("Invalid product id"),
  handleValidation,
];

// Staff adds or edits a customer by hand. No password, and the email is optional
const staffFields = (required) => [
  (required ? body("firstName") : body("firstName").optional())
    .trim()
    .notEmpty()
    .withMessage("First name is required"),
  body("lastName").optional({ nullable: true }).trim(),
  (required ? body("phone") : body("phone").optional())
    .trim()
    .notEmpty()
    .withMessage("Phone is required"),
  body("email")
    .optional({ values: "falsy" })
    .isEmail()
    .withMessage("Enter a valid email or leave it empty")
    .normalizeEmail(),
];
const staffCreateRules = [...staffFields(true), handleValidation];
const staffUpdateRules = [...staffFields(false), handleValidation];

module.exports = {
  staffCreateRules,
  staffUpdateRules,
  profileRules,
  addressCreateRules,
  addressUpdateRules,
  statusRules,
  productIdParam,
};
