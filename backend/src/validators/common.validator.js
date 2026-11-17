const { param, validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

// Runs after validation rules: if any rule failed, stop with a 400 error listing the problems
const handleValidation = (req, res, next) => {
  const result = validationResult(req); // collects the failures from the rules above it
  if (!result.isEmpty()) {
    // Turn each failure into { field, message } so the frontend can show it next to the input
    const details = result
      .array()
      .map((e) => ({ field: e.path, message: e.msg }));
    throw new ApiError(400, "Validation failed", details);
  }
  next();   
};

const idParam = [
  param("id").isUUID().withMessage("Invalid id"),
  handleValidation,
];

module.exports = { handleValidation, idParam };
