const service = require("./brands.service");
const { sendSuccess } = require("../../utils/ApiResponse");

const list = async (req, res) => {
  sendSuccess(res, await service.listActive());
};

const listAll = async (req, res) => {
  sendSuccess(res, await service.listAll());
};

const getOne = async (req, res) => {
  sendSuccess(res, await service.getById(req.params.id));
};

const create = async (req, res) => {
  sendSuccess(res, await service.create(req.body), "Brand created", 201);
};

const update = async (req, res) => {
  sendSuccess(
    res,
    await service.update(req.params.id, req.body),
    "Brand updated",
  );
};

const remove = async (req, res) => {
  await service.remove(req.params.id);
  sendSuccess(res, null, "Brand deleted");
};

module.exports = { list, listAll, getOne, create, update, remove };
