const service = require("./products.service");
const { sendSuccess, sendPaginated } = require("../../utils/ApiResponse");

// Public list: active products with filters and pages
const list = async (req, res) => {
  const { items, page, limit, total } = await service.list(req.query, true);
  sendPaginated(res, items, page, limit, total);
};

// Staff list: every status
const listAll = async (req, res) => {
  const { items, page, limit, total } = await service.list(req.query, false);
  sendPaginated(res, items, page, limit, total);
};

const getBySlug = async (req, res) => {
  sendSuccess(res, await service.getBySlug(req.params.slug));
};

const getOne = async (req, res) => {
  sendSuccess(res, await service.getById(req.params.id));
};

const create = async (req, res) => {
  sendSuccess(res, await service.create(req.body), "Product created", 201);
};

const update = async (req, res) => {
  sendSuccess(
    res,
    await service.update(req.params.id, req.body),
    "Product updated",
  );
};

const remove = async (req, res) => {
  await service.remove(req.params.id);
  sendSuccess(res, null, "Product deleted");
};

module.exports = { list, listAll, getBySlug, getOne, create, update, remove };
