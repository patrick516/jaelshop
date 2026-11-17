const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");

const omitPassword = { passwordHash: true }; // never send the password hash to anyone

/* ---------- Staff side ---------- */

// Customers table: ?search=grace&page=1&limit=10
const list = async (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const where = {};
  if (query.search) {
    // match first name, last name, email or phone, ignoring upper/lower case
    where.OR = ["firstName", "lastName", "email", "phone"].map((f) => ({
      [f]: { contains: query.search, mode: "insensitive" },
    }));
  }
  const [items, total] = await prisma.$transaction([
    prisma.customer.findMany({
      where,
      omit: omitPassword,
      include: { _count: { select: { orders: true } } }, // order count per customer
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.customer.count({ where }),
  ]);
  return { items, page, limit, total };
};

// One customer with addresses and their 10 latest orders
const getById = async (id) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    omit: omitPassword,
    include: {
      addresses: true,
      orders: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!customer) throw new ApiError(404, "Customer not found");
  return customer;
};

// A suspended customer can no longer log in (authenticate checks status)
const updateStatus = (id, status) =>
  prisma.customer.update({
    where: { id },
    data: { status },
    omit: omitPassword,
  });

/* ---------- Customer side ("My account") ---------- */

const getProfile = (id) =>
  prisma.customer.findUnique({ where: { id }, omit: omitPassword });

const updateProfile = (id, body) => {
  const { firstName, lastName, phone } = body; // email and password are not changed here
  return prisma.customer.update({
    where: { id },
    data: { firstName, lastName, phone },
    omit: omitPassword,
  });
};

const listAddresses = (customerId) =>
  prisma.address.findMany({
    where: { customerId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

// Only the fields we allow from the request body
const addressData = (body) => {
  const { label, fullName, phone, district, area, addressLine } = body;
  return { label, fullName, phone, district, area, addressLine };
};

// The first address is always the default. A new default un-defaults the others
const createAddress = (customerId, body) =>
  prisma.$transaction(async (tx) => {
    const count = await tx.address.count({ where: { customerId } });
    const makeDefault = Boolean(body.isDefault) || count === 0;
    if (makeDefault)
      await tx.address.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    return tx.address.create({
      data: { ...addressData(body), isDefault: makeDefault, customerId },
    });
  });

// Find an address only if it belongs to this customer
const ownAddress = async (customerId, id) => {
  const address = await prisma.address.findFirst({ where: { id, customerId } });
  if (!address) throw new ApiError(404, "Address not found");
  return address;
};

const updateAddress = async (customerId, id, body) => {
  await ownAddress(customerId, id);
  return prisma.$transaction(async (tx) => {
    if (body.isDefault === true || body.isDefault === "true") {
      await tx.address.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }
    const data = addressData(body);
    if (body.isDefault !== undefined)
      data.isDefault = body.isDefault === true || body.isDefault === "true";
    return tx.address.update({ where: { id }, data });
  });
};

const deleteAddress = async (customerId, id) => {
  await ownAddress(customerId, id);
  await prisma.address.delete({ where: { id } });
};

// Wishlist with the main picture and price of each product (no cost price)
const listWishlist = (customerId) =>
  prisma.wishlistItem.findMany({
    where: { customerId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          status: true,
          images: { where: { isPrimary: true }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

// upsert = adding the same product twice is harmless
const addWishlist = (customerId, productId) =>
  prisma.wishlistItem.upsert({
    where: { customerId_productId: { customerId, productId } }, // the pair made by @@unique
    update: {},
    create: { customerId, productId },
  });

// deleteMany does not fail when the item is already gone
const removeWishlist = (customerId, productId) =>
  prisma.wishlistItem.deleteMany({ where: { customerId, productId } });

module.exports = {
  list,
  getById,
  updateStatus,
  getProfile,
  updateProfile,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  listWishlist,
  addWishlist,
  removeWishlist,
};
