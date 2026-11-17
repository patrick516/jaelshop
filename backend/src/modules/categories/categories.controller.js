const service = require("./categories.service");
const { sendSuccess } = require("../../utils/ApiResponse");

// Each function reads the request, calls the service, and sends the result

const list = async (req, res) => {
  sendSuccess(res, await service.listActive());
};

const listAll = async (req, res) => {
  sendSuccess(res, await service.listAll());
};

const getOne = async (req, res) => {
  sendSuccess(res, await service.getById(req.params.id)); // :id from the URL
};

const create = async (req, res) => {
  sendSuccess(res, await service.create(req.body), "Category created", 201);
};

const update = async (req, res) => {
  sendSuccess(
    res,
    await service.update(req.params.id, req.body),
    "Category updated",
  );
};

const remove = async (req, res) => {
  await service.remove(req.params.id);
  sendSuccess(res, null, "Category deleted");
};

module.exports = { list, listAll, getOne, create, update, remove };
