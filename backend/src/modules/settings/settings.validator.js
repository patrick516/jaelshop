const { body } = require("express-validator");
const { handleValidation } = require("../../validators/common.validator");

// Every field is optional, but valid if sent. optional({ values: 'falsy' }) also lets "" through to clear a value
const updateRules = [
  body("storeName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Store name cannot be empty"),
  body("whatsappNumber")
    .optional({ values: "falsy" })
    .matches(/^\+?[0-9 ]{9,18}$/)
    .withMessage(
      "Enter a valid phone number, e.g. 0999123456 or +265999123456",
    ),
  body("deliveryFee")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Delivery fee must be a number"),
  body("airtelMoneyNumber").optional().trim(),
  body("tnmMpambaNumber").optional().trim(),
  handleValidation,
];

module.exports = { updateRules };
