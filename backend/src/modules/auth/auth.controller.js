const authService = require("./auth.service");
const { sendSuccess } = require("../../utils/ApiResponse");

const staffLogin = async (req, res) => {
  const data = await authService.loginStaff(req.body.email, req.body.password);
  sendSuccess(res, data, "Login successful");
};

const customerRegister = async (req, res) => {
  const data = await authService.registerCustomer(req.body);
  sendSuccess(res, data, "Account created", 201);
};

const customerLogin = async (req, res) => {
  const data = await authService.loginCustomer(
    req.body.email,
    req.body.password,
  );
  sendSuccess(res, data, "Login successful");
};

const me = async (req, res) => {
  sendSuccess(res, req.user);
};

module.exports = { staffLogin, customerRegister, customerLogin, me };
