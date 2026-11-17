const service = require("./suppliers.service");
const { sendSuccess } = require("../../utils/ApiResponse");

const list = async (req, res) => {
  sendSuccess(res, await service.list());
};

const getOne = async (req, res) => {
  sendSuccess(res, await service.getById(req.params.id));
};

const create = async (req, res) => {
  sendSuccess(res, await service.create(req.body), "Supplier created", 201);
};

const update = async (req, res) => {
  sendSuccess(
    res,
    await service.update(req.params.id, req.body),
    "Supplier updated",
  );
};

const remove = async (req, res) => {
  await service.remove(req.params.id);
  sendSuccess(res, null, "Supplier deleted");
};

module.exports = { list, getOne, create, update, remove };
