const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const { round2, sumPaid } = require("../../utils/money");

const mk = (n) => `MK ${n.toLocaleString("en-US")}`; // 2600 becomes "MK 2,600" in error messages

// Staff marks an order as SOLD after agreeing the final price on WhatsApp.
// body (all optional): agreedTotal, amountPaid, method, phoneNumber, transactionRef
const sell = (id, body) =>
  prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id }, include: { payments: true } });
    if (!order) throw new ApiError(404, "Order not found");
    if (["CANCELLED", "REFUNDED"].includes(order.status)) throw new ApiError(400, `This order is ${order.status.toLowerCase()}`);
    if (order.status === "DELIVERED") throw new ApiError(400, "This order is already marked as sold");

    // 1. The price. With no agreedTotal the order is sold at its current total
    const current = Number(order.total);
    const agreed = round2(body.agreedTotal === undefined ? current : Number(body.agreedTotal));
    const diff = round2(current - agreed); // above 0 = the customer pays less, below 0 = more
    let discountTotal = Number(order.discountTotal);
    let deliveryFee = Number(order.deliveryFee);
    if (diff > 0) discountTotal = round2(discountTotal + diff); // a lower price is recorded as a discount
    if (diff < 0) deliveryFee = round2(deliveryFee - diff); // a higher price is recorded as an extra charge (diff is negative, so this adds)
    if (discountTotal > Number(order.subtotal)) throw new ApiError(400, "The agreed price is too low");

    // 2. The money. paidBefore = installments already received
    const paidBefore = sumPaid(order.payments);
    if (paidBefore > agreed) throw new ApiError(400, `Already received ${mk(paidBefore)}, which is more than the agreed price`);
    const owed = round2(agreed - paidBefore);
    const received = round2(body.amountPaid === undefined ? owed : Number(body.amountPaid)); // default: paid in full
    if (received > owed) throw new ApiError(400, `The customer only owes ${mk(owed)}`);
    const left = round2(owed - received); // what stays as the customer's balance
    if (left > 0 && !order.customerId) throw new ApiError(400, "Link this order to a customer first, so the balance can be tracked");

    // 3. Record the money received now. The method defaults to the one the customer chose
    const waiting = order.payments.find((p) => p.status === "PENDING");
    const method = body.method || waiting?.method;
    if (received > 0) {
      if (!method) throw new ApiError(400, "Choose how the money was paid");
      await tx.payment.create({
        data: {
          orderId: id, method, status: "PAID", amount: received,
          phoneNumber: body.phoneNumber, transactionRef: body.transactionRef, paidAt: new Date(),
        },
      });
    }

    // 4. The waiting payment always shows what is still owed (same rule as payments.service record)
    if (left <= 0) await tx.payment.deleteMany({ where: { orderId: id, status: "PENDING" } });
    else if (waiting) await tx.payment.update({ where: { id: waiting.id }, data: { amount: left } });
    else await tx.payment.create({ data: { orderId: id, method: method || "CASH_ON_DELIVERY", status: "PENDING", amount: left } });

    // 5. Save the new price and close the order. listTotal keeps the price before the deal
    const updated = await tx.order.update({
      where: { id },
      data: { status: "DELIVERED", total: agreed, discountTotal, deliveryFee, listTotal: current, soldAt: new Date() },
      include: { items: true, payments: true },
    });
    return { ...updated, balance: left, discountGiven: Math.max(0, diff) };
  });

module.exports = { sell };
