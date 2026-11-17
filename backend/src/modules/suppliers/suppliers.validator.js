const { body } = require("express-validator");
const { handleValidation } = require("../../validators/common.validator");

// Create: only name is required
const createRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("contactPerson").optional({ nullable: true }).trim(),
  body("phone").optional({ nullable: true }).trim(),
  body("email")
    .optional({ nullable: true })
    .isEmail()
    .withMessage("Invalid email"),
  body("address").optional({ nullable: true }).trim(),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
  handleValidation,
];

// Update: all optional, valid if sent
const updateRules = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("contactPerson").optional({ nullable: true }).trim(),
  body("phone").optional({ nullable: true }).trim(),
  body("email")
    .optional({ nullable: true })
    .isEmail()
    .withMessage("Invalid email"),
  body("address").optional({ nullable: true }).trim(),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
  handleValidation,
];

module.exports = { createRules, updateRules };
