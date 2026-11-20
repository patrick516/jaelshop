const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const { findUsable, describe } = require("./coupons.apply");

// Only the fields we allow from the request body. Codes are always saved in capitals
const pickFields = (b) => ({
  code: b.code ? b.code.trim().toUpperCase() : undefined,
  discountType: b.discountType,
  discountValue: b.discountValue,
  minOrderAmount: b.minOrderAmount, // null clears it
  maxUses: b.maxUses,
  startsAt: b.startsAt,
  expiresAt: b.expiresAt,
  isActive: b.isActive,
});

const list = () => prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

// A duplicate code becomes a 409 through errorHandler
const create = (body) => prisma.coupon.create({ data: pickFields(body) });

// A missing id becomes a 404 through errorHandler (Prisma P2025)
const update = (id, body) => prisma.coupon.update({ where: { id }, data: pickFields(body) });

// Orders that used the code keep their discount (their coupon link is simply cleared)
const remove = (id) => prisma.coupon.delete({ where: { id } });

// The storefront asks "what does this code take off my cart?". Prices come from the database
const check = async (body) => {
  const ids = body.items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: ids } },
    include: { product: true },
  });
  if (variants.length !== new Set(ids).size)
    throw new ApiError(400, "One or more items do not exist");

  const subtotal = body.items.reduce((sum, item) => {
    const v = variants.find((x) => x.id === item.variantId);
    return sum + Number(v.priceOverride ?? v.product.price) * item.quantity;
  }, 0);

  const { coupon, discount } = await findUsable(prisma, body.code, subtotal);
  return { code: coupon.code, discount, label: describe(coupon) };
};

module.exports = { list, create, update, remove, check };
