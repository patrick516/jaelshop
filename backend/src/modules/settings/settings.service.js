const { prisma } = require("../../config/database");
const { normalizePhone } = require("../../utils/whatsapp");

// Used when a setting has not been saved yet, so the app always has a value
const DEFAULTS = {
  storeName: "JAEL Enterprise",
  whatsappNumber: "",
  airtelMoneyNumber: "",
  tnmMpambaNumber: "",
};

// Merge saved values over the defaults and return one plain object
const getAll = async () => {
  const rows = await prisma.setting.findMany();
  const settings = { ...DEFAULTS };
  rows.forEach((row) => {
    if (row.key in DEFAULTS) settings[row.key] = row.value; // ignore unknown keys
  });
  return settings;
};

const update = async (body) => {
  const writes = Object.keys(DEFAULTS)
    .filter((key) => body[key] !== undefined)
    .map((key) => {
      let value = String(body[key]).trim();
      if (key === "whatsappNumber") value = normalizePhone(value);

      return prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    });
  await prisma.$transaction(writes);
  return getAll();
};

module.exports = { getAll, update };
