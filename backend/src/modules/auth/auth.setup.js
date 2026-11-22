const bcrypt = require("bcryptjs");
const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const { uploadBuffer, deletePicture } = require("../../utils/cloudinaryStorage");

const LOCK = 424242; // any fixed number. Two setups at the same moment wait for each other on it
const CLOSED = "Setup is already complete. Ask an administrator to add you from Staff Users";

// True only while there is not a single staff account
const needsSetup = async () => (await prisma.user.count()) === 0;

// Creates the first Administrator. Works once: after any staff account exists it is refused
const createFirstAdmin = async (body, file) => {
  if (!(await needsSetup())) throw new ApiError(403, CLOSED);

  const passwordHash = await bcrypt.hash(body.password, 10);
  // The picture is uploaded only after everything else has passed, so a refused setup leaves nothing behind
  const avatarUrl = file ? (await uploadBuffer(file.buffer, "jael-staff")).url : null;

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${LOCK})`;
      if ((await tx.user.count()) > 0) throw new ApiError(403, CLOSED); // someone else finished first

      const role = await tx.role.upsert({
        where: { name: "Administrator" },
        update: {},
        create: { name: "Administrator", description: "Full access", permissions: ["*"] },
      });
      const user = await tx.user.create({
        data: { firstName: body.firstName, lastName: body.lastName, email: body.email, passwordHash, avatarUrl, roleId: role.id },
      });
      return { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, avatarUrl, role: role.name };
    });
  } catch (err) {
    if (avatarUrl) await deletePicture(avatarUrl); // do not leave an unused picture in Cloudinary
    throw err;
  }
};

module.exports = { needsSetup, createFirstAdmin };
