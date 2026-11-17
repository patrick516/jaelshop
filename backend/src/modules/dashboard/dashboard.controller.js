const service = require("./dashboard.service");
const { sendSuccess } = require("../../utils/ApiResponse");

const get = async (req, res) => {
  sendSuccess(res, await service.summary(req.query));
};

module.exports = { get };
