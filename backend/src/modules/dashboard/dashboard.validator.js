const { query } = require("express-validator");
const { handleValidation } = require("../../validators/common.validator");

// ?days=7, 30, 90 or 365 (the 7D / 30D / 90D / 1Y buttons). Query values are always text
const summaryRules = [
  query("days")
    .optional()
    .isIn(["7", "30", "90", "365"])
    .withMessage("days must be 7, 30, 90 or 365"),
  handleValidation,
];

module.exports = { summaryRules };
