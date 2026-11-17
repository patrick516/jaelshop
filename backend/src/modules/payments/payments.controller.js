const service = require("./payments.service");
const { sendSuccess, sendPaginated } = require("../../utils/ApiResponse");

const list = async (req, res) => {
  const { items, page, limit, total } = await service.list(req.query);
  sendPaginated(res, items, page, limit, total);
};

const update = async (req, res) => {
  sendSuccess(
    res,
    await service.update(req.params.id, req.body),
    "Payment updated",
  );
};

module.exports = { list, update };
