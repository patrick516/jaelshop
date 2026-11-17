const { body } = require("express-validator");
const { handleValidation } = require("../../validators/common.validator");

// Staff user fields. required = true on create, false on update
const userFields = (required) => {
  const field = (name) => (required ? body(name) : body(name).optional());
  return [
    field("firstName").trim().notEmpty().withMessage("First name is required"),
    field("lastName").trim().notEmpty().withMessage("Last name is required"),
    field("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
    field("roleId").isUUID().withMessage("Valid role is required"),
    field("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("phone").optional({ nullable: true }).trim(),
  ];
};

const createUserRules = [...userFields(true), handleValidation];
const updateUserRules = [
  ...userFields(false),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE", "SUSPENDED"])
    .withMessage("Invalid status"),
  handleValidation,
];

// Role fields: name (required on create), description, and a list of permission keys
const roleFields = (required) => [
  (required ? body("name") : body("name").optional())
    .trim()
    .notEmpty()
    .withMessage("Role name is required"),
  body("description").optional({ nullable: true }).trim(),
  body("permissions")
    .optional()
    .isArray()
    .withMessage("Permissions must be a list"),
  body("permissions.*").isString().withMessage("Each permission must be text"), // * = every item in the list
];

const createRoleRules = [...roleFields(true), handleValidation];
const updateRoleRules = [...roleFields(false), handleValidation];

module.exports = {
  createUserRules,
  updateUserRules,
  createRoleRules,
  updateRoleRules,
};
