const express = require("express");
const rateLimit = require("express-rate-limit"); // limits how often one IP can call a route
const controller = require("./orders.controller");
const { createRules, statusRules } = require("./orders.validator");
const { idParam } = require("../../validators/common.validator");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");

const router = express.Router();

// Public guest order from the "Order via WhatsApp" button (no login).
// It must stay ABOVE router.use(authenticate). Max 10 per hour per IP stops spam.
router.post(
  "/whatsapp",
  rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
  }),
  createRules,
  controller.createWhatsapp,
);

router.use(authenticate);

router.post("/", createRules, controller.create);
router.get("/mine", controller.listMine);
router.get("/", authorize(), controller.list);
router.get("/:id/whatsapp", authorize(), idParam, controller.customerLink);
router.get("/:id", idParam, controller.getOne);
router.patch(
  "/:id/status",
  authorize(),
  idParam,
  statusRules,
  controller.updateStatus,
); // staff only

module.exports = router;
