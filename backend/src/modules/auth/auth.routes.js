const express = require("express");
const controller = require("./auth.controller");
const { loginRules, registerRules, setupRules } = require("./auth.validator");
const authenticate = require("../../middleware/authenticate");
const rateLimit = require("express-rate-limit");
const { single } = require("../../middleware/upload");
const router = express.Router();
// First-time setup. Works only while there are no staff accounts at all
router.get("/setup-status", controller.setupStatus);
router.post(
  "/setup",
  rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
  }),
  single,
  setupRules,
  controller.setup,
);

router.post("/staff/login", loginRules, controller.staffLogin);
router.post("/register", registerRules, controller.customerRegister);
router.post("/login", loginRules, controller.customerLogin);
router.get("/me", authenticate, controller.me);

module.exports = router;
