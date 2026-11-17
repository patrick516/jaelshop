const express = require("express");
const controller = require("./categories.controller");
const { createRules, updateRules } = require("./categories.validator");
const { idParam } = require("../../validators/common.validator");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");

const router = express.Router();

// Public: the storefront reads these without logging in
router.get("/", controller.list);

router.get("/all", authenticate, authorize(), controller.listAll);

router.get("/:id", idParam, controller.getOne);

router.post("/", authenticate, authorize(), createRules, controller.create);
router.put(
  "/:id",
  authenticate,
  authorize(),
  idParam,
  updateRules,
  controller.update,
);
router.delete("/:id", authenticate, authorize(), idParam, controller.remove);

module.exports = router;
