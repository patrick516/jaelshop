const { body } = require("express-validator");
const { handleValidation } = require("../../validators/common.validator");

// Create: name required, the rest optional
const createRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("logoUrl").optional({ nullable: true }).trim(),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
  handleValidation,
];

const updateRules = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("logoUrl").optional({ nullable: true }).trim(),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
  handleValidation,
];

module.exports = { createRules, updateRules };
