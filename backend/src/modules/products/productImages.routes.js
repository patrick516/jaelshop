const express = require("express");
const { body, param } = require("express-validator");
const { handleValidation } = require("../../validators/common.validator");
const { sendSuccess } = require("../../utils/ApiResponse");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const service = require("./products.images");

const router = express.Router();
const staff = [authenticate, authorize()]; // per route, so public product routes are never touched

const ids = [
  param("id").isUUID().withMessage("Invalid product id"),
  param("imageId").optional().isUUID().withMessage("Invalid picture id"),
  handleValidation,
];
const urlRules = [
  body("url").trim().isURL({ require_tld: false }).withMessage("Enter a valid picture link"),
  body("altText").optional({ nullable: true }).trim(),
  handleValidation,
];

router.post("/:id/images", staff, ids, urlRules, async (req, res) =>
  sendSuccess(res, await service.addImage(req.params.id, req.body), "Picture added", 201),
);

router.patch("/:id/images/:imageId/primary", staff, ids, async (req, res) => {
  await service.setPrimary(req.params.id, req.params.imageId);
  sendSuccess(res, null, "Main picture changed");
});

router.delete("/:id/images/:imageId", staff, ids, async (req, res) => {
  await service.removeImage(req.params.id, req.params.imageId);
  sendSuccess(res, null, "Picture removed");
});

module.exports = router;
