const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const { normalizePhone } = require("../../utils/whatsapp");

const omitPassword = { passwordHash: true };
const clean = (v) => (v === undefined ? undefined : v || null); // an empty text becomes null (email must stay unique)

// The same number can be typed as 0999123456 or +265 999 123 456, so numbers are compared in one format
const checkPhone = async (phone, exceptId) => {
  if (!phone) return;
  const key = normalizePhone(phone);
  const others = await prisma.customer.findMany({
    where: { phone: { not: null }, ...(exceptId && { id: { not: exceptId } }) },
    select: { phone: true },
  });
  if (others.some((c) => normalizePhone(c.phone) === key)) {
    throw new ApiError(409, "A customer with this phone number already exists");
  }
};

// Staff adds a customer by hand (no password). Needed for people who buy on loan
const create = async (body) => {
  await checkPhone(body.phone);
  return prisma.customer.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName || "",
      phone: clean(body.phone),
      email: clean(body.email),
    },
    omit: omitPassword,
  });
};

const update = async (id, body) => {
  await checkPhone(body.phone, id);
  return prisma.customer.update({
    where: { id },
    data: {
      firstName: body.firstName,
      lastName: body.lastName ?? undefined,
      phone: clean(body.phone),
      email: clean(body.email),
    },
    omit: omitPassword, // a missing id becomes a 404 through errorHandler
  });
};

module.exports = { create, update };
