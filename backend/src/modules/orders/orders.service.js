const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");

const settingsService = require("../settings/settings.service");
const {
  buildLink,
  orderMessage,
  customerMessage,
} = require("../../utils/whatsapp");
const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

// Order number like JE202611170421 (JE + date + 4 random digits)
const makeOrderNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `JE${date}${Math.floor(1000 + Math.random() * 9000)}`;
};

const createOrder = async (body, user) => {
  const isStaff = user.type === "staff";
  const settings = await settingsService.getAll(); // owner number, store name, delivery fee
  const deliveryFee = Number(settings.deliveryFee) || 0;

  const order = await prisma.$transaction(async (tx) => {
    // 1. Load every variant the customer asked for, with its product
    const ids = body.items.map((i) => i.variantId);
    const variants = await tx.productVariant.findMany({
      where: { id: { in: ids } },
      include: { product: true },
    });
    if (variants.length !== new Set(ids).size)
      throw new ApiError(400, "One or more items do not exist");

    // 2. Build the order lines using prices from the database
    const lines = body.items.map((item) => {
      const v = variants.find((x) => x.id === item.variantId);
      if (!v.isActive || v.product.status !== "ACTIVE") {
        throw new ApiError(400, `${v.product.name} is not available`);
      }
      const unitPrice = Number(v.priceOverride ?? v.product.price); // variant price wins if set
      return {
        variantId: v.id,
        productName: v.product.name, // copied so later edits never change old orders
        variantLabel: [v.size, v.color].filter(Boolean).join(" / ") || null,
        unitPrice,
        quantity: item.quantity,
        lineTotal: unitPrice * item.quantity,
      };
    });
    const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    const total = subtotal + deliveryFee;

    // 3. Reduce stock. The "gte" check means two buyers can never take the last item
    for (const line of lines) {
      const result = await tx.inventory.updateMany({
        where: { variantId: line.variantId, quantity: { gte: line.quantity } },
        data: { quantity: { decrement: line.quantity } },
      });
      if (result.count === 0)
        throw new ApiError(409, `Not enough stock for ${line.productName}`);
      await tx.stockMovement.create({
        data: {
          variantId: line.variantId,
          type: "SALE",
          quantity: -line.quantity, // negative = stock removed
          note: "Order sale",
          userId: isStaff ? user.id : null,
        },
      });
    }

    // 4. Save the order, its lines and its first payment record
    return tx.order.create({
      data: {
        orderNumber: makeOrderNumber(),
        customerId: isStaff ? body.customerId || null : user.id, // customers can only order for themselves
        source: isStaff ? body.source || "ADMIN" : user.source || "WEBSITE", // guests carry source WHATSAPP
        subtotal,
        deliveryFee,
        total,
        shippingName: body.shippingName,
        shippingPhone: body.shippingPhone,
        shippingDistrict: body.shippingDistrict,
        shippingArea: body.shippingArea,
        shippingAddress: body.shippingAddress,
        notes: body.notes,
        items: { create: lines },
        payments: {
          create: {
            method: body.paymentMethod || "CASH_ON_DELIVERY",
            amount: total,
            phoneNumber: body.paymentPhone,
          },
        },
      },
      include: { items: true, payments: true },
    });
  });

  // Click-to-chat link that opens WhatsApp to the owner with the order already written
  const whatsappUrl = settings.whatsappNumber
    ? buildLink(
        settings.whatsappNumber,
        orderMessage(order, settings.storeName),
      )
    : null; // null until the owner number is set in Settings
  return { ...order, whatsappUrl };
};
// Staff list with filters: ?status=PENDING&search=JE2026&page=1&limit=10
const list = async (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const where = {};
  if (STATUSES.includes(query.status)) where.status = query.status;
  if (query.search) {
    where.OR = [
      { orderNumber: { contains: query.search, mode: "insensitive" } },
      { shippingName: { contains: query.search, mode: "insensitive" } },
    ];
  }
  const [items, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: {
        _count: { select: { items: true } }, // for "3 items" in the table
        payments: { select: { method: true, status: true } },
        customer: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);
  return { items, page, limit, total };
};

// A customer's own orders (the "My Orders" screen)
const listMine = (user) => {
  if (user.type !== "customer") throw new ApiError(403, "Customers only");
  return prisma.order.findMany({
    where: { customerId: user.id },
    include: { items: true, payments: true },
    orderBy: { createdAt: "desc" },
  });
};

// One order. A customer can only open their own
const getById = async (id, user) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      payments: true,
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  });
  if (!order || (user.type === "customer" && order.customerId !== user.id)) {
    throw new ApiError(404, "Order not found"); // same message so customers cannot probe other orders
  }
  return order;
};

// Change the status. Cancelling returns the stock
const updateStatus = (id, status, userId) =>
  prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new ApiError(404, "Order not found");
    if (["CANCELLED", "REFUNDED"].includes(order.status)) {
      throw new ApiError(400, `Order is already ${order.status.toLowerCase()}`);
    }

    if (status === "CANCELLED") {
      for (const item of order.items) {
        await tx.inventory.update({
          where: { variantId: item.variantId },
          data: { quantity: { increment: item.quantity } }, // put the stock back
        });
        await tx.stockMovement.create({
          data: {
            variantId: item.variantId,
            type: "RETURN",
            quantity: item.quantity,
            note: `Cancelled ${order.orderNumber}`,
            userId,
          },
        });
      }
      // Unpaid payments of a cancelled order can no longer be paid
      await tx.payment.updateMany({
        where: { orderId: id, status: "PENDING" },
        data: { status: "FAILED" },
      });
    }

    return tx.order.update({
      where: { id },
      data: { status },
      include: { items: true, payments: true },
    });
  });

// Link staff click to message the customer about their order on WhatsApp
const customerLink = async (id) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new ApiError(404, "Order not found");
  const settings = await settingsService.getAll();
  return {
    url: buildLink(
      order.shippingPhone,
      customerMessage(order, settings.storeName),
    ),
  };
};

module.exports = {
  createOrder,
  list,
  listMine,
  getById,
  updateStatus,
  customerLink,
};
