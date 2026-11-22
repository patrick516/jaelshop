const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const slugify = require("../../utils/slugify");

const { deletePicture } = require("../../utils/cloudinaryStorage");
const productInclude = {
  images: { orderBy: { sortOrder: "asc" } },
  category: { select: { id: true, name: true, slug: true } },
  brand: { select: { id: true, name: true, slug: true } },
  variants: { include: { inventory: true } },
};

// Public responses must never show what JAEL paid
const publicOmit = { costPrice: true };

const STATUSES = ["DRAFT", "ACTIVE", "ARCHIVED"];

// Only the product fields we allow from the request body
const productFields = (body) => {
  const {
    name,
    description,
    price,
    compareAtPrice,
    costPrice,
    status,
    isFeatured,
    categoryId,
    brandId,
    supplierId,
  } = body;
  return {
    name,
    description,
    price,
    compareAtPrice,
    costPrice,
    status,
    isFeatured,
    categoryId,
    brandId,
    supplierId,
  };
};

// Builds the filter from the URL query, e.g. ?category=stationery&search=note
const buildWhere = (query, publicOnly) => {
  const where = {};
  if (publicOnly)
    where.status = "ACTIVE"; // shoppers see active products only
  else if (STATUSES.includes(query.status)) where.status = query.status;
  if (query.category) where.category = { slug: query.category };
  if (query.brand) where.brand = { slug: query.brand };
  if (query.featured === "true") where.isFeatured = true;
  if (query.search)
    where.name = { contains: query.search, mode: "insensitive" }; // ignore upper/lower case
  return where;
};

// One list function for both public and admin
const list = async (query, publicOnly) => {
  const page = Math.max(1, parseInt(query.page) || 1); // page number, minimum 1
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 12)); // 12 default, 100 maximum
  const where = buildWhere(query, publicOnly);

  // Run the page query and the total count together
  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
      ...(publicOnly && { omit: publicOmit }),
      orderBy: { createdAt: "desc" }, // newest first
      skip: (page - 1) * limit, // skip the earlier pages
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);
  return { items, page, limit, total };
};

// Public product page, found by slug (only active products)
const getBySlug = async (slug) => {
  const product = await prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: {
      ...productInclude,
      reviews: {
        where: { isApproved: true },
        select: { rating: true, comment: true, createdAt: true },
      },
    },
    omit: publicOmit,
  });
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

// Admin: one product by id, including costPrice and supplier
const getById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { ...productInclude, supplier: true },
  });
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

// Create the product, its images, variants and stock in ONE database operation
const create = (body) => {
  const slug = slugify(body.name);
  const variants = body.variants && body.variants.length ? body.variants : [{}]; // one default variant

  return prisma.product.create({
    data: {
      ...productFields(body),
      slug,
      images: {
        create: (body.images || []).map((img, i) => ({
          url: img.url,
          altText: img.altText,
          sortOrder: i,
          isPrimary: img.isPrimary ?? i === 0, // first image is primary unless told otherwise
        })),
      },
      variants: {
        create: variants.map((v, i) => ({
          sku: v.sku || `${slug}-${i + 1}`.toUpperCase(), // auto SKU like A4-NOTEBOOK-1
          size: v.size,
          color: v.color,
          priceOverride: v.priceOverride,
          inventory: {
            create: {
              quantity: v.quantity ?? 0,
              lowStockThreshold: v.lowStockThreshold ?? 5,
            },
          },
        })),
      },
    },
    include: productInclude,
  });
};

// Update the main fields (variants and stock are changed in the inventory module)
const update = async (id, body) => {
  await getById(id); // clean 404 if missing
  const data = productFields(body);
  if (data.name) data.slug = slugify(data.name);
  return prisma.product.update({
    where: { id },
    data,
    include: productInclude,
  });
};

const remove = async (id) => {
  const product = await getById(id);
  await prisma.product.delete({ where: { id } }); // fails first if the product has orders, so its pictures are kept
  await Promise.all(product.images.map((i) => deletePicture(i.url)));
};

module.exports = { list, getBySlug, getById, create, update, remove };
