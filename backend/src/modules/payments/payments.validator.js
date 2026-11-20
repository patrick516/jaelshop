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

// Staff records money received for an order (one installment of a loan)
const recordRules = [
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be more than 0"),
  body("method")
    .isIn(["AIRTEL_MONEY", "TNM_MPAMBA", "CASH_ON_DELIVERY", "BANK_TRANSFER"])
    .withMessage("Invalid payment method"),
  body("phoneNumber").optional({ nullable: true }).trim(),
  body("transactionRef").optional({ nullable: true }).trim(),
  handleValidation,
];

module.exports = { updateRules, recordRules };
