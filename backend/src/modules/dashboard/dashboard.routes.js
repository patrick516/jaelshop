const express = require("express");
const controller = require("./dashboard.controller");
const { summaryRules } = require("./dashboard.validator");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");

const router = express.Router();

router.get("/", authenticate, authorize(), summaryRules, controller.get); // staff only

module.exports = router;
