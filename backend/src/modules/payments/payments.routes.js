const express = require("express");
const controller = require("./payments.controller");
const { updateRules } = require("./payments.validator");
const { idParam } = require("../../validators/common.validator");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");

const router = express.Router();

router.use(authenticate, authorize()); // staff only for every payment route

router.get("/", controller.list);
router.patch("/:id", idParam, updateRules, controller.update);

module.exports = router;
