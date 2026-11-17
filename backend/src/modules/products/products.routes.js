const express = require("express");
const controller = require("./products.controller");
const { createRules, updateRules } = require("./products.validator");
const { idParam } = require("../../validators/common.validator");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");

const router = express.Router();

router.get("/", controller.list); // public list
router.get("/all", authenticate, authorize(), controller.listAll); // staff list, above '/:id'
router.get("/slug/:slug", controller.getBySlug); // public product page, above '/:id'
router.get("/:id", authenticate, authorize(), idParam, controller.getOne); // staff, by id
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
