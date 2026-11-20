const service = require("./coupons.service");
const { sendSuccess } = require("../../utils/ApiResponse");

const list = async (req, res) => sendSuccess(res, await service.list());
const create = async (req, res) => sendSuccess(res, await service.create(req.body), "Code created", 201);
const update = async (req, res) => sendSuccess(res, await service.update(req.params.id, req.body), "Code updated");
const check = async (req, res) => sendSuccess(res, await service.check(req.body), "Code applied");

const remove = async (req, res) => {
  await service.remove(req.params.id);
  sendSuccess(res, null, "Code deleted");
};

module.exports = { list, create, update, remove, check };
