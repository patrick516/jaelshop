const express = require("express");
const controller = require("./customers.controller");
const {
  profileRules,
  addressCreateRules,
  addressUpdateRules,
  statusRules,
  productIdParam,
} = require("./customers.validator");
const { idParam } = require("../../validators/common.validator");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const { customerOnly } = authorize; // the check we just added

const router = express.Router();

router.use(authenticate); // every route needs a login

// Customer self-service. These come FIRST so "me" is never read as an :id
router.get("/me", customerOnly, controller.getProfile);
router.put("/me", customerOnly, profileRules, controller.updateProfile);
router.get("/me/addresses", customerOnly, controller.listAddresses);
router.post(
  "/me/addresses",
  customerOnly,
  addressCreateRules,
  controller.createAddress,
);
router.put(
  "/me/addresses/:id",
  customerOnly,
  idParam,
  addressUpdateRules,
  controller.updateAddress,
);
router.delete(
  "/me/addresses/:id",
  customerOnly,
  idParam,
  controller.deleteAddress,
);
router.get("/me/wishlist", customerOnly, controller.listWishlist);
router.post(
  "/me/wishlist/:productId",
  customerOnly,
  productIdParam,
  controller.addWishlist,
);
router.delete(
  "/me/wishlist/:productId",
  customerOnly,
  productIdParam,
  controller.removeWishlist,
);

// Staff only
router.get("/", authorize(), controller.list);
router.get("/:id", authorize(), idParam, controller.getOne);
router.patch(
  "/:id/status",
  authorize(),
  idParam,
  statusRules,
  controller.updateStatus,
);

module.exports = router;
