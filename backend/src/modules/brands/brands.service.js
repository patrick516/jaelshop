const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const slugify = require("../../utils/slugify");

// Only the fields we allow from the request body
const pickFields = (body) => {
  const { name, logoUrl, isActive } = body;
  return { name, logoUrl, isActive };
};

const listActive = () =>
  prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

const listAll = () =>
  prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

const getById = async (id) => {
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) throw new ApiError(404, "Brand not found");
  return brand;
};

const create = (body) => {
  const data = pickFields(body);
  data.slug = slugify(data.name);
  return prisma.brand.create({ data });
};

const update = async (id, body) => {
  await getById(id);
  const data = pickFields(body);
  if (data.name) data.slug = slugify(data.name);
  return prisma.brand.update({ where: { id }, data });
};

const remove = async (id) => {
  await getById(id);
  await prisma.brand.delete({ where: { id } });
};

module.exports = { listActive, listAll, getById, create, update, remove };
