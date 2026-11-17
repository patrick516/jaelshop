const { body } = require("express-validator");
const { handleValidation } = require("../../validators/common.validator");

// Rules shared by create and update. "required" decides if a field must be sent
const fieldRules = (required) => {
  // Starts a rule for one field: mandatory on create, optional on update
  const field = (name) => (required ? body(name) : body(name).optional());
  return [
    field("name").trim().notEmpty().withMessage("Name is required"),
    field("price").isFloat({ min: 0 }).withMessage("Price must be a number"),
    body("compareAtPrice")
      .optional({ nullable: true })
      .isFloat({ min: 0 })
      .withMessage("Compare price must be a number"),
    body("costPrice")
      .optional({ nullable: true })
      .isFloat({ min: 0 })
      .withMessage("Cost price must be a number"),
    body("description").optional({ nullable: true }).trim(),
    body("status")
      .optional()
      .isIn(["DRAFT", "ACTIVE", "ARCHIVED"])
      .withMessage("Invalid status"),
    body("isFeatured")
      .optional()
      .isBoolean()
      .withMessage("isFeatured must be true or false"),
    field("categoryId").isUUID().withMessage("Valid category is required"),
    body("brandId")
      .optional({ nullable: true })
      .isUUID()
      .withMessage("Invalid brand id"),
    body("supplierId")
      .optional({ nullable: true })
      .isUUID()
      .withMessage("Invalid supplier id"),
  ];
};

const createRules = [
  ...fieldRules(true),
  body("images").optional().isArray().withMessage("Images must be a list"),
  body("images.*.url").notEmpty().withMessage("Each image needs a url"), // * = every item in the list
  body("variants").optional().isArray().withMessage("Variants must be a list"),
  body("variants.*.quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantity must be 0 or more"),
  body("variants.*.priceOverride")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("Variant price must be a number"),
  handleValidation, // must be last, it reads the results of the rules above
];

const updateRules = [...fieldRules(false), handleValidation];

module.exports = { createRules, updateRules };
