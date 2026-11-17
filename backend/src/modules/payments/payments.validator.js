const { body } = require("express-validator");
const { handleValidation } = require("../../validators/common.validator");

// Staff confirms or rejects a payment, optionally saving the Airtel / TNM / bank reference
const updateRules = [
  body("status")
    .isIn(["PENDING", "PAID", "FAILED", "REFUNDED"])
    .withMessage("Invalid status"),
  body("transactionRef").optional({ nullable: true }).trim(),
  handleValidation,
];

module.exports = { updateRules };
