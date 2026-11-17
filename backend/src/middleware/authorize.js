const ApiError = require("../utils/ApiError");

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || req.user.type !== "staff") {
      throw new ApiError(403, "Staff access only");
    }
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to do this");
    }
    next();
  };

// Allows only logged-in customers (shoppers), used by the "My account" routes
const customerOnly = (req, res, next) => {
  if (!req.user || req.user.type !== "customer") {
    throw new ApiError(403, "Customers only");
  }
  next();
};

module.exports = authorize;
module.exports.customerOnly = customerOnly; // reachable as require(...).customerOnly
