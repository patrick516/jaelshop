// Moves the pictures saved on this computer (backend/uploads) to Cloudinary and updates their addresses.
//   node src/utils/migratePictures.js          shows what would happen
//   node src/utils/migratePictures.js --apply  does it
const fs = require("fs/promises");
const path = require("path");
const { prisma, disconnectDB } = require("../config/database");
const { publicIdFromUrl, uploadFile } = require("./cloudinaryStorage");

const DIR = path.join(__dirname, "..", "..", "uploads");
const APPLY = process.argv.includes("--apply");

// The old upload saved pictures at an address ending in /uploads/<file>. Gives the file name, or null for any other address
const localName = (url) => {
  try {
    const { pathname } = new URL(url);
    return pathname.startsWith("/uploads/") ? path.basename(pathname) : null;
  } catch {
    return null;
  }
};

const kb = (bytes) => `${Math.max(1, Math.round(bytes / 1024))} KB`;

const main = async () => {
  const images = await prisma.productImage.findMany({
    include: { product: { select: { name: true } } },
    orderBy: [{ productId: "asc" }, { sortOrder: "asc" }],
  });
  const count = { moved: 0, missing: 0, failed: 0, skipped: 0 };

  for (const img of images) {
    const label = img.product.name;
    const file = localName(img.url);

    if (!file) {
      count.skipped++;
      console.log(`SKIP     ${label}: ${publicIdFromUrl(img.url) ? "already on Cloudinary" : `other address (${img.url.slice(0, 50)})`}`);
      continue;
    }
    const full = path.join(DIR, file);
    const stat = await fs.stat(full).catch(() => null);
    if (!stat) {
      count.missing++;
      console.log(`MISSING  ${label}: ${file} is not in backend/uploads`);
      continue;
    }
    if (!APPLY) {
      count.moved++;
      console.log(`WOULD MOVE  ${label}: ${file} (${kb(stat.size)})`);
      continue;
    }
    try {
      const { url } = await uploadFile(full);
      await prisma.productImage.update({ where: { id: img.id }, data: { url } }); // saved at once, so stopping halfway loses nothing
      count.moved++;
      console.log(`MOVED    ${label}: ${file} (${kb(stat.size)})`);
    } catch (err) {
      count.failed++;
      console.log(`FAILED   ${label}: ${file} (${err.message})`);
    }
  }

  console.log(`\n${APPLY ? "Moved" : "Would move"} ${count.moved}, missing ${count.missing}, failed ${count.failed}, skipped ${count.skipped}.`);
  if (!APPLY && count.moved > 0) console.log("Run it again with --apply to do it.");
};

main()
  .catch((e) => console.error(e))
  .finally(disconnectDB);
