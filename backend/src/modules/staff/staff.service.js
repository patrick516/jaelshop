const bcrypt = require("bcryptjs");
const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");

const omitPassword = { passwordHash: true }; // never send the password hash out
const withRole = { role: { select: { id: true, name: true } } };

/* ---------- Staff users ---------- */

// ?search=patrick&page=1&limit=10
const listUsers = async (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const where = {};
  if (query.search) {
    where.OR = ["firstName", "lastName", "email"].map((f) => ({
      [f]: { contains: query.search, mode: "insensitive" },
    }));
  }
  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      omit: omitPassword,
      include: withRole,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);
  return { items, page, limit, total };
};

const getUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    omit: omitPassword,
    include: withRole,
  });
  if (!user) throw new ApiError(404, "Staff user not found");
  return user;
};

// A duplicate email becomes a 409 through errorHandler. An unknown roleId becomes a 400 (Prisma P2003)
const createUser = async (body) => {
  const { firstName, lastName, email, phone, roleId, password } = body;
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { firstName, lastName, email, phone, roleId, passwordHash },
    omit: omitPassword,
    include: withRole,
  });
};

const updateUser = async (id, body, actorId) => {
  await getUser(id); // clean 404 if missing
  // Stops you locking yourself out of the admin panel
  if (id === actorId && body.status && body.status !== "ACTIVE") {
    throw new ApiError(400, "You cannot deactivate your own account");
  }
  const { firstName, lastName, email, phone, roleId, status } = body;
  const data = { firstName, lastName, email, phone, roleId, status };
  if (body.password) data.passwordHash = await bcrypt.hash(body.password, 10); // only when a new password is sent
  return prisma.user.update({
    where: { id },
    data,
    omit: omitPassword,
    include: withRole,
  });
};

const deleteUser = async (id, actorId) => {
  if (id === actorId)
    throw new ApiError(400, "You cannot delete your own account");
  await getUser(id);
  await prisma.user.delete({ where: { id } });
};

/* ---------- Roles ---------- */

const listRoles = () =>
  prisma.role.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { users: true } } },
  });

const pickRole = (body) => {
  const { name, description, permissions } = body;
  return { name, description, permissions };
};

const createRole = (body) => prisma.role.create({ data: pickRole(body) });

// The Administrator role is protected, because authorize("Administrator") depends on its name
const editableRole = async (id) => {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw new ApiError(404, "Role not found");
  if (role.name === "Administrator")
    throw new ApiError(400, "The Administrator role cannot be changed");
  return role;
};

const updateRole = async (id, body) => {
  await editableRole(id);
  return prisma.role.update({ where: { id }, data: pickRole(body) });
};

// A role that still has staff fails with a clear message (Prisma P2003 in errorHandler)
const deleteRole = async (id) => {
  await editableRole(id);
  await prisma.role.delete({ where: { id } });
};

/* ---------- Activity logs ---------- */

// ?entity=products&page=1&limit=20
const listActivity = async (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const where = query.entity ? { entity: query.entity } : {};
  const [items, total] = await prisma.$transaction([
    prisma.activityLog.findMany({
      where,
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.activityLog.count({ where }),
  ]);
  return { items, page, limit, total };
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
