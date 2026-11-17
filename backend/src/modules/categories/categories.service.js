const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const slugify = require("../../utils/slugify");

const pickFields = (body) => {
  const { name, description, imageUrl, sortOrder, isActive, parentId } = body;
  return { name, description, imageUrl, sortOrder, isActive, parentId };
};

// Public list: only active categories, with their active sub-categories
const listActive = () =>
  prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }], // sort order first, then A to Z
    include: { children: { where: { isActive: true } } },
  });

// Admin list: every category, plus how many products each one has
const listAll = () =>
  prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } }, // _count gives the product total
  });

// Find one category, or stop with a 404
const getById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { children: true },
  });
  if (!category) throw new ApiError(404, "Category not found");
  return category;
};

// Create: the slug is built from the name
const create = (body) => {
  const data = pickFields(body);
  data.slug = slugify(data.name);

  return prisma.category.create({ data });
};

const update = async (id, body) => {
  await getById(id);
  const data = pickFields(body);
  if (data.name) data.slug = slugify(data.name);
  return prisma.category.update({ where: { id }, data });
};

const remove = async (id) => {
  await getById(id);
  await prisma.category.delete({ where: { id } });
};

module.exports = { listActive, listAll, getById, create, update, remove };
