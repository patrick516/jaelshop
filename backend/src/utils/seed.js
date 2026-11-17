const bcrypt = require("bcryptjs");
const { prisma, disconnectDB } = require("../config/database");

const main = async () => {
  // Create the Administrator role if it does not exist yet (upsert = update or insert)
  const role = await prisma.role.upsert({
    where: { name: "Administrator" },
    update: {},
    create: {
      name: "Administrator",
      description: "Full access",
      permissions: ["*"],
    },
  });

  const passwordHash = await bcrypt.hash("Admin@12345", 10);

  // Create your admin account if it does not exist yet
  await prisma.user.upsert({
    where: { email: "patrick@jael.mw" },
    update: {},
    create: {
      firstName: "Patrick",
      lastName: "Kulinji",
      email: "patrick@jael.mw",
      passwordHash,
      roleId: role.id,
    },
  });

  console.log("Seed done: patrick@jael.mw / Admin@12345");
};

main()
  .catch((e) => console.error(e))
  .finally(disconnectDB);
