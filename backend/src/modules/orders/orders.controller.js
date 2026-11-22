const service = require("./orders.service");
const { sell } = require("./orders.sell");
const { sendSuccess, sendPaginated } = require("../../utils/ApiResponse");

// req.user is set by the authenticate middleware (id and type: staff or customer)

const create = async (req, res) => {
  sendSuccess(
    res,
    await service.createOrder(req.body, req.user),
    "Order placed",
    201,
  );
};

const list = async (req, res) => {
  const { items, page, limit, total } = await service.list(req.query);
  sendPaginated(res, items, page, limit, total);
};

const listMine = async (req, res) => {
  sendSuccess(res, await service.listMine(req.user));
};

const getOne = async (req, res) => {
  sendSuccess(res, await service.getById(req.params.id, req.user));
};

const updateStatus = async (req, res) => {
  sendSuccess(
    res,
    await service.updateStatus(req.params.id, req.body.status, req.user.id),
    "Order status updated",
  );
};

// Guest order from the product page "Order via WhatsApp" button (no login)
const createWhatsapp = async (req, res) => {
  const guest = { type: "guest", source: "WHATSAPP" };
  sendSuccess(
    res,
    await service.createOrder(req.body, guest),
    "Order placed",
    201,
  );
};

// Guest order from the website checkout (no login). Saved as a WEBSITE order
const createGuest = async (req, res) => {
  const guest = { type: "guest", source: "WEBSITE" };
  sendSuccess(
    res,
    await service.createOrder(req.body, guest),
    "Order placed",
    201,
  );
};

// Staff marks an order as sold at the price agreed on WhatsApp
const sellOrder = async (req, res) => {
  sendSuccess(res, await sell(req.params.id, req.body), "Order marked as sold");
};

const customerLink = async (req, res) => {
  sendSuccess(res, await service.customerLink(req.params.id));
};

const setCustomer = async (req, res) =>
  sendSuccess(
    res,
    await service.setCustomer(req.params.id, req.body.customerId),
    "Customer updated",
  );

module.exports = {
  setCustomer,
  create,
  createWhatsapp,
  sellOrder,
  createGuest,
  list,
  listMine,
  getOne,
  updateStatus,
  customerLink,
};
