const { prisma, disconnectDB } = require("../config/database");

// Creates only the Administrator role. The first administrator account is made on the admin panel's
// first-time setup page, so a default password never exists
const main = async () => {
  await prisma.role.upsert({
    where: { name: "Administrator" },
    update: {},
    create: { name: "Administrator", description: "Full access", permissions: ["*"] },
  });
  console.log("Seed done: the Administrator role is ready. Open the admin panel to create the first administrator.");
};

main()
  .catch((e) => console.error(e))
  .finally(disconnectDB);
