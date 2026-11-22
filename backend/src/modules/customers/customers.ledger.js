const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const { round2, sumPaid } = require("../../utils/money");
const { totalsByCustomer } = require("./customers.balance");

const omitPassword = { passwordHash: true }; // never send the password hash out
const NONE = { orderCount: 0, ordered: 0, paid: 0, balance: 0 };

// Staff list: ?search=grace&owing=true&page=1&limit=10. Every row carries what the customer owes.
// Balances come from the orders, so this is done in JavaScript, which is fine for a shop's customers
const list = async (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const where = {};
  if (query.search) {
    where.OR = ["firstName", "lastName", "email", "phone"].map((f) => ({
      [f]: { contains: query.search, mode: "insensitive" },
    }));
  }
  const [customers, totals] = await Promise.all([
    prisma.customer.findMany({
      where,
      omit: omitPassword,
      orderBy: { createdAt: "desc" },
    }),
    totalsByCustomer(),
  ]);

  let rows = customers.map((c) => ({ ...c, ...(totals.get(c.id) ?? NONE) }));
  if (query.owing === "true") {
    rows = rows.filter((r) => r.balance > 0).sort((a, b) => b.balance - a.balance); // biggest debt first
  }
  return {
    items: rows.slice((page - 1) * limit, page * limit),
    page,
    limit,
    total: rows.length,
  };
};

// The numbers on top of the Customers page
const summary = async () => {
  const [customerCount, totals] = await Promise.all([
    prisma.customer.count(),
    totalsByCustomer(),
  ]);
  const owing = [...totals.values()].filter((t) => t.balance > 0);
  return {
    customerCount,
    owingCount: owing.length,
    totalOwed: round2(owing.reduce((sum, t) => sum + t.balance, 0)),
  };
};

// One customer with every order and what is still owed on it
const getById = async (id) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    omit: omitPassword,
  });
  if (!customer) throw new ApiError(404, "Customer not found");

  const [orders, totals] = await Promise.all([
    prisma.order.findMany({
      where: { customerId: id },
      orderBy: { createdAt: "desc" },
      include: { payments: { select: { status: true, amount: true } } },
    }),
    totalsByCustomer(),
  ]);

  const rows = orders.map((o) => {
    const paid = sumPaid(o.payments);
    const open = !["PENDING", "CANCELLED", "REFUNDED"].includes(o.status); // closed orders owe nothing
    return {
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: o.total,
      createdAt: o.createdAt,
      paid,
      balance: open ? round2(Number(o.total) - paid) : 0,
    };
  });
  return { ...customer, ...(totals.get(id) ?? NONE), orders: rows };
};

module.exports = { list, summary, getById };
