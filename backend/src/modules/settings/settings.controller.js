const service = require("./settings.service");
const { sendSuccess } = require("../../utils/ApiResponse");

const get = async (req, res) => {
  sendSuccess(res, await service.getAll());
};

const update = async (req, res) => {
  sendSuccess(res, await service.update(req.body), "Settings saved");
};

module.exports = { get, update };
