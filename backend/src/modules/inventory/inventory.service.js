const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");

// Inventory page rows: ?search=note&lowStock=true&page=1&limit=20
// Filtering by "quantity <= threshold" compares two columns, so it is done in JavaScript.
// That is fine for a shop catalogue of a few hundred variants.
const list = async (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const where = {};
  if (query.search) {
    where.OR = [
      { sku: { contains: query.search, mode: "insensitive" } },
      { product: { name: { contains: query.search, mode: "insensitive" } } },
    ];
  }
  const variants = await prisma.productVariant.findMany({
    where,
    include: { inventory: true, product: { select: { id: true, name: true } } },
    orderBy: [{ product: { name: "asc" } }, { sku: "asc" }],
  });

  // One flat row per variant, with a low stock flag
  let rows = variants.map((v) => {
    const quantity = v.inventory?.quantity ?? 0;
    const lowStockThreshold = v.inventory?.lowStockThreshold ?? 5;
    return {
      variantId: v.id,
      productId: v.product.id,
      productName: v.product.name,
      sku: v.sku,
      size: v.size,
      color: v.color,
      isActive: v.isActive,
      quantity,
      lowStockThreshold,
      isLowStock: quantity <= lowStockThreshold,
    };
  });
  if (query.lowStock === "true") rows = rows.filter((r) => r.isLowStock);

  const total = rows.length;
  return {
    items: rows.slice((page - 1) * limit, page * limit),
    page,
    limit,
    total,
  };
};

// Add a new size or colour to an existing product, with its opening stock
const addVariant = async (productId, body) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError(404, "Product not found");
  const sku = (
    body.sku || `${product.slug}-${Date.now().toString(36)}`
  ).toUpperCase(); // auto SKU if none sent
  return prisma.productVariant.create({
    data: {
      productId,
      sku,
      size: body.size,
      color: body.color,
      priceOverride: body.priceOverride,
      inventory: {
        create: {
          quantity: body.quantity ?? 0,
          lowStockThreshold: body.lowStockThreshold ?? 5,
        },
      },
    },
    include: { inventory: true },
  });
};

// Edit a variant. A missing id becomes a 404 through errorHandler (Prisma P2025)
const updateVariant = (variantId, body) => {
  const { sku, size, color, priceOverride, isActive } = body;
  return prisma.productVariant.update({
    where: { id: variantId },
    data: {
      sku: sku ? sku.toUpperCase() : undefined,
      size,
      color,
      priceOverride,
      isActive,
    },
    include: { inventory: true },
  });
};

// Add or remove stock and keep a history line, all in one transaction
const adjust = (variantId, body, userId) =>
  prisma.$transaction(async (tx) => {
    const delta = Number(body.quantity); // + adds, - removes
    const inv = await tx.inventory.findUnique({ where: { variantId } });
    if (!inv) throw new ApiError(404, "Variant not found");

    // For removals the row must hold at least that many, so stock never goes below zero
    const result = await tx.inventory.updateMany({
      where: { variantId, quantity: { gte: delta < 0 ? -delta : 0 } },
      data: { quantity: { increment: delta } },
    });
    if (result.count === 0)
      throw new ApiError(400, "Stock cannot go below zero");

    await tx.stockMovement.create({
      data: {
        variantId,
        type: body.type || "ADJUSTMENT",
        quantity: delta,
        note: body.note,
        userId,
      },
    });
    return tx.inventory.findUnique({ where: { variantId } });
  });

// Stock history of one variant, newest first
const movements = (variantId) =>
  prisma.stockMovement.findMany({
    where: { variantId },
    include: { user: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

module.exports = { list, addVariant, updateVariant, adjust, movements };
