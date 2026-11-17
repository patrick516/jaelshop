const { body } = require("express-validator");
const { handleValidation } = require("../../validators/common.validator");

// Rules when creating a category: name is required, the rest are optional
const createRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("description").optional({ nullable: true }).trim(), // nullable lets the client send null
  body("imageUrl").optional({ nullable: true }).trim(),
  body("sortOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sort order must be a number"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
  body("parentId")
    .optional({ nullable: true })
    .isUUID()
    .withMessage("Invalid parent id"),
  handleValidation,
];

const updateRules = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("description").optional({ nullable: true }).trim(),
  body("imageUrl").optional({ nullable: true }).trim(),
  body("sortOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sort order must be a number"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
  body("parentId")
    .optional({ nullable: true })
    .isUUID()
    .withMessage("Invalid parent id"),
  handleValidation,
];

module.exports = { createRules, updateRules };
