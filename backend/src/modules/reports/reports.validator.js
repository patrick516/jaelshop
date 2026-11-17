const { query } = require("express-validator");
const { handleValidation } = require("../../validators/common.validator");

// Dates must look like 2026-11-30. Query values arrive as text
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const rangeRules = [
  query("from")
    .optional()
    .matches(DATE)
    .withMessage("from must look like 2026-11-01"),
  query("to")
    .optional()
    .matches(DATE)
    .withMessage("to must look like 2026-11-30"),
  query("group")
    .optional()
    .isIn(["day", "month"])
    .withMessage("group must be day or month"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("limit must be 1 to 50"),
  handleValidation, // must be last, it reads the results of the rules above
];

module.exports = { rangeRules };
