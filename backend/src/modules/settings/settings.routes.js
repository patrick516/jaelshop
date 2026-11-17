const express = require("express");
const controller = require("./settings.controller");
const { updateRules } = require("./settings.validator");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");

const router = express.Router();

router.get("/", controller.get); // public: the storefront needs the WhatsApp number and delivery fee
router.put(
  "/",
  authenticate,
  authorize("Administrator"),
  updateRules,
  controller.update,
); // Administrator only

module.exports = router;
