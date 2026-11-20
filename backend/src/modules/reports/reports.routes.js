const express = require("express");
const controller = require("./reports.controller");
const { rangeRules } = require("./reports.validator");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const profit = require("./reports.profit");
const { sendSuccess } = require("../../utils/ApiResponse");

const router = express.Router();

router.use(authenticate, authorize());

router.get("/sales", rangeRules, controller.sales);
router.get("/top-products", rangeRules, controller.topProducts);
router.get("/payments", rangeRules, controller.payments);
router.get("/stock", controller.stock);
router.get("/profit", rangeRules, async (req, res) =>
  sendSuccess(res, await profit.report(req.query)),
);

module.exports = router;
