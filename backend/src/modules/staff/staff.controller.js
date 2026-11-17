const service = require("./staff.service");
const { sendSuccess, sendPaginated } = require("../../utils/ApiResponse");

// req.user.id is the logged-in staff member, used to protect them from deleting themselves

const listUsers = async (req, res) => {
  const { items, page, limit, total } = await service.listUsers(req.query);
  sendPaginated(res, items, page, limit, total);
};
const getUser = async (req, res) =>
  sendSuccess(res, await service.getUser(req.params.id));
const createUser = async (req, res) =>
  sendSuccess(
    res,
    await service.createUser(req.body),
    "Staff user created",
    201,
  );
const updateUser = async (req, res) =>
  sendSuccess(
    res,
    await service.updateUser(req.params.id, req.body, req.user.id),
    "Staff user updated",
  );
const deleteUser = async (req, res) => {
  await service.deleteUser(req.params.id, req.user.id);
  sendSuccess(res, null, "Staff user deleted");
};

const listRoles = async (req, res) =>
  sendSuccess(res, await service.listRoles());
const createRole = async (req, res) =>
  sendSuccess(res, await service.createRole(req.body), "Role created", 201);
const updateRole = async (req, res) =>
  sendSuccess(
    res,
    await service.updateRole(req.params.id, req.body),
    "Role updated",
  );
const deleteRole = async (req, res) => {
  await service.deleteRole(req.params.id);
  sendSuccess(res, null, "Role deleted");
};

const listActivity = async (req, res) => {
  const { items, page, limit, total } = await service.listActivity(req.query);
  sendPaginated(res, items, page, limit, total);
};

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  listRoles,
  createRole,
  updateRole,
  deleteRole,
  listActivity,
};
