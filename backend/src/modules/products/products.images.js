const fs = require("fs/promises");
const path = require("path");
const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const { UPLOAD_DIR } = require("../../middleware/upload");

const OWN_FILE = /^\d+-[0-9a-f]{12}\.(jpg|png|webp|gif)$/; // the names our upload creates

// Deletes the file from disk when the picture was uploaded here. Links to other sites are left alone
const deleteFile = async (url) => {
  try {
    const name = path.basename(new URL(url).pathname);
    if (OWN_FILE.test(name)) await fs.unlink(path.join(UPLOAD_DIR, name));
  } catch {
    // the file is already gone, or the link is not a valid address
  }
};

// The first picture of a product becomes its main picture
const addImage = async (productId, body) => {
  const product = await prisma.product.findUnique({ where: { id: productId }, include: { images: true } });
  if (!product) throw new ApiError(404, "Product not found");
  return prisma.productImage.create({
    data: {
      productId,
      url: body.url,
      altText: body.altText,
      sortOrder: product.images.length,
      isPrimary: product.images.length === 0,
    },
  });
};

// Finds a picture only if it belongs to this product
const ownImage = async (productId, imageId) => {
  const image = await prisma.productImage.findFirst({ where: { id: imageId, productId } });
  if (!image) throw new ApiError(404, "Picture not found");
  return image;
};

// Removing the main picture makes the next one the main picture
const removeImage = async (productId, imageId) => {
  const image = await ownImage(productId, imageId);
  await prisma.productImage.delete({ where: { id: imageId } });
  if (image.isPrimary) {
    const next = await prisma.productImage.findFirst({ where: { productId }, orderBy: { sortOrder: "asc" } });
    if (next) await prisma.productImage.update({ where: { id: next.id }, data: { isPrimary: true } });
  }
  await deleteFile(image.url);
};

const setPrimary = async (productId, imageId) => {
  await ownImage(productId, imageId);
  await prisma.$transaction([
    prisma.productImage.updateMany({ where: { productId }, data: { isPrimary: false } }),
    prisma.productImage.update({ where: { id: imageId }, data: { isPrimary: true } }),
  ]);
};

module.exports = { addImage, removeImage, setPrimary };
