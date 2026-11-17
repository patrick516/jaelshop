const service = require("./inventory.service");
const { sendSuccess, sendPaginated } = require("../../utils/ApiResponse");

const list = async (req, res) => {
  const { items, page, limit, total } = await service.list(req.query);
  sendPaginated(res, items, page, limit, total);
};

const addVariant = async (req, res) =>
  sendSuccess(
    res,
    await service.addVariant(req.params.productId, req.body),
    "Variant added",
    201,
  );

const updateVariant = async (req, res) =>
  sendSuccess(
    res,
    await service.updateVariant(req.params.variantId, req.body),
    "Variant updated",
  );

// req.user.id records which staff member changed the stock
const adjust = async (req, res) =>
  sendSuccess(
    res,
    await service.adjust(req.params.variantId, req.body, req.user.id),
    "Stock updated",
  );

const movements = async (req, res) =>
  sendSuccess(res, await service.movements(req.params.variantId));

module.exports = { list, addVariant, updateVariant, adjust, movements };
