const authService = require("./auth.service");
const { sendSuccess } = require("../../utils/ApiResponse");
const setupService = require("./auth.setup");

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

// Does the system still have no staff at all? The admin panel asks this before showing the login
const setupStatus = async (req, res) =>
  sendSuccess(res, { needsSetup: await setupService.needsSetup() });

// Creates the first administrator, once
const setup = async (req, res) =>
  sendSuccess(
    res,
    await setupService.createFirstAdmin(req.body, req.file),
    "Administrator account created",
    201,
  );

module.exports = {
  staffLogin,
  customerRegister,
  customerLogin,
  me,
  setupStatus,
  setup,
};
