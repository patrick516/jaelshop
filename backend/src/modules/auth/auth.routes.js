const express = require("express");
const controller = require("./auth.controller");
const { loginRules, registerRules } = require("./auth.validator");
const authenticate = require("../../middleware/authenticate");

const router = express.Router();

router.post("/staff/login", loginRules, controller.staffLogin);
router.post("/register", registerRules, controller.customerRegister);
router.post("/login", loginRules, controller.customerLogin);
router.get("/me", authenticate, controller.me);

module.exports = router;
