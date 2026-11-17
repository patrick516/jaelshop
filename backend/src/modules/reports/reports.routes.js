const express = require("express");
const controller = require("./reports.controller");
const { rangeRules } = require("./reports.validator");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");

const router = express.Router();

router.use(authenticate, authorize()); // staff only for every report

router.get("/sales", rangeRules, controller.sales);
router.get("/top-products", rangeRules, controller.topProducts);
router.get("/payments", rangeRules, controller.payments);
router.get("/stock", controller.stock);

module.exports = router;
