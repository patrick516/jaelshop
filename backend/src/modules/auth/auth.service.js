const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");

const signToken = (id, type) =>
  jwt.sign({ id, type }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const loginStaff = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (user.status !== "ACTIVE") {
    throw new ApiError(403, "This account is disabled");
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  return {
    token: signToken(user.id, "staff"),
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role.name,
    },
  };
};

// Customer registration (storefront)
const registerCustomer = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
}) => {
  const passwordHash = await bcrypt.hash(password, 10);

  const customer = await prisma.customer.create({
    data: { firstName, lastName, email, phone, passwordHash },
  });
  return {
    token: signToken(customer.id, "customer"),
    customer: { id: customer.id, firstName, lastName, email },
  };
};

// Customer login (storefront)
const loginCustomer = async (email, password) => {
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (
    !customer?.passwordHash ||
    !(await bcrypt.compare(password, customer.passwordHash))
  ) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (customer.status !== "ACTIVE") {
    throw new ApiError(403, "This account is disabled");
  }
  return {
    token: signToken(customer.id, "customer"),
    customer: {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
    },
  };
};

module.exports = { loginStaff, registerCustomer, loginCustomer };
