const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");

// Only the fields we allow from the request body
const pickFields = (body) => {
  const { name, contactPerson, phone, email, address, isActive } = body;
  return { name, contactPerson, phone, email, address, isActive };
};

// Staff-only list with product count (suppliers are never shown publicly)
const list = () =>
  prisma.supplier.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

const getById = async (id) => {
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier) throw new ApiError(404, "Supplier not found");
  return supplier;
};

const create = (body) => prisma.supplier.create({ data: pickFields(body) });

const update = async (id, body) => {
  await getById(id);
  return prisma.supplier.update({ where: { id }, data: pickFields(body) });
};

const remove = async (id) => {
  await getById(id);
  await prisma.supplier.delete({ where: { id } });
};

module.exports = { list, getById, create, update, remove };
