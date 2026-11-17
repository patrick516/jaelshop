const service = require("./reports.service");
const { sendSuccess } = require("../../utils/ApiResponse");

const sales = async (req, res) =>
  sendSuccess(res, await service.sales(req.query));
const topProducts = async (req, res) =>
  sendSuccess(res, await service.topProducts(req.query));
const payments = async (req, res) =>
  sendSuccess(res, await service.payments(req.query));
const stock = async (req, res) => sendSuccess(res, await service.stock());

module.exports = { sales, topProducts, payments, stock };
