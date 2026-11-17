const express = require("express");
const controller = require("./suppliers.controller");
const { createRules, updateRules } = require("./suppliers.validator");
const { idParam } = require("../../validators/common.validator");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");

const router = express.Router();

router.use(authenticate, authorize());

router.get("/", controller.list);
router.get("/:id", idParam, controller.getOne);
router.post("/", createRules, controller.create);
router.put("/:id", idParam, updateRules, controller.update);
router.delete("/:id", idParam, controller.remove);

module.exports = router;
