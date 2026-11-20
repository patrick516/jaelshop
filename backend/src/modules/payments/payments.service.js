const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const { round2, sumPaid } = require("../../utils/money");

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

// Record money received for an order, e.g. one installment of a loan.
// The waiting (pending) payment always shows what is still owed
const record = (orderId, body) =>
  prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });
    if (!order) throw new ApiError(404, "Order not found");
    if (["CANCELLED", "REFUNDED"].includes(order.status))
      throw new ApiError(400, `This order is ${order.status.toLowerCase()}`);

    const amount = round2(Number(body.amount));
    const balance = round2(Number(order.total) - sumPaid(order.payments));
    if (amount > balance)
      throw new ApiError(400, `The balance is only MK ${balance.toLocaleString("en-US")}`);

    const payment = await tx.payment.create({
      data: {
        orderId,
        method: body.method,
        status: "PAID",
        amount,
        phoneNumber: body.phoneNumber,
        transactionRef: body.transactionRef,
        paidAt: new Date(),
      },
    });

    const left = round2(balance - amount);
    const waiting = order.payments.find((p) => p.status === "PENDING");
    if (left <= 0)
      await tx.payment.deleteMany({ where: { orderId, status: "PENDING" } });
    else if (waiting)
      await tx.payment.update({ where: { id: waiting.id }, data: { amount: left } });
    return { ...payment, balance: left };
  });

module.exports = { list, update, record };
