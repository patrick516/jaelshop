const service = require("./orders.service");
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

const customerLink = async (req, res) => {
  sendSuccess(res, await service.customerLink(req.params.id));
};

module.exports = {
  create,
  createWhatsapp,
  list,
  listMine,
  getOne,
  updateStatus,
  customerLink,
};
