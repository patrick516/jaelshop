const express = require("express");
const controller = require("./staff.controller");
const {
  createUserRules,
  updateUserRules,
  createRoleRules,
  updateRoleRules,
} = require("./staff.validator");
const { idParam } = require("../../validators/common.validator");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");

const router = express.Router();

router.use(authenticate, authorize("Administrator")); // only Administrators manage staff

// "roles" and "activity" come BEFORE "/:id", or they would be read as an id
router.get("/roles", controller.listRoles);
router.post("/roles", createRoleRules, controller.createRole);
router.put("/roles/:id", idParam, updateRoleRules, controller.updateRole);
router.delete("/roles/:id", idParam, controller.deleteRole);

router.get("/activity", controller.listActivity);

router.get("/", controller.listUsers);
router.get("/:id", idParam, controller.getUser);
router.post("/", createUserRules, controller.createUser);
router.put("/:id", idParam, updateUserRules, controller.updateUser);
router.delete("/:id", idParam, controller.deleteUser);

module.exports = router;
