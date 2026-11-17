const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { prisma } = require("../config/database");
const ApiError = require("../utils/ApiError");

// Checks the login token and attaches the logged-in person to req.user
const authenticate = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Please log in first");
  }

  const payload = jwt.verify(token, env.jwtSecret);

  if (payload.type === "staff") {
    // Load the staff member with their role so authorize can check permissions
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { role: true },
    });
    if (!user || user.status !== "ACTIVE") {
      throw new ApiError(401, "Account not found or disabled");
    }
    req.user = {
      id: user.id,
      type: "staff",
      role: user.role.name,
      permissions: user.role.permissions,
    };
  } else {
    const customer = await prisma.customer.findUnique({
      where: { id: payload.id },
    });
    if (!customer || customer.status !== "ACTIVE") {
      throw new ApiError(401, "Account not found or disabled");
    }
    req.user = { id: customer.id, type: "customer" };
  }

  next();
};

module.exports = authenticate;
