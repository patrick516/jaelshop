const express = require("express");
const rateLimit = require("express-rate-limit");
const controller = require("./coupons.controller");
const { createRules, updateRules, checkRules } = require("./coupons.validator");
const { idParam } = require("../../validators/common.validator");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");

const router = express.Router();

// Public: the storefront checks a code. Limited, so nobody can guess codes quickly.
// It must stay ABOVE router.use(authenticate)
router.post(
  "/check",
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false }),
  checkRules,
  controller.check,
);

router.use(authenticate, authorize()); // staff only for everything below

router.get("/", controller.list);
router.post("/", createRules, controller.create);
router.put("/:id", idParam, updateRules, controller.update);
router.delete("/:id", idParam, controller.remove);

module.exports = router;
