const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");

const STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];
const METHODS = [
  "AIRTEL_MONEY",
  "TNM_MPAMBA",
  "CASH_ON_DELIVERY",
  "BANK_TRANSFER",
];

// List with filters: ?status=PENDING&method=AIRTEL_MONEY&page=1
const list = async (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const where = {};
  if (STATUSES.includes(query.status)) where.status = query.status;
  if (METHODS.includes(query.method)) where.method = query.method;

  const [items, total] = await prisma.$transaction([
    prisma.payment.findMany({
      where,
      include: {
        order: {
          select: { orderNumber: true, shippingName: true, total: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.payment.count({ where }),
  ]);
  return { items, page, limit, total };
};

// Mark a payment paid, failed or refunded
const update = async (id, body) => {
  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment) throw new ApiError(404, "Payment not found");
  return prisma.payment.update({
    where: { id },
    data: {
      status: body.status,
      transactionRef: body.transactionRef, // undefined is ignored, so an old reference stays
      paidAt: body.status === "PAID" ? new Date() : null, // time stamp only when paid
    },
  });
};

module.exports = { list, update };
