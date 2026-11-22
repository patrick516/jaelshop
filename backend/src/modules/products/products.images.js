const { prisma } = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const { deletePicture } = require("../../utils/cloudinaryStorage");

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

// Removing the main picture makes the next one the main picture. The file is deleted from Cloudinary too
const removeImage = async (productId, imageId) => {
  const image = await ownImage(productId, imageId);
  await prisma.productImage.delete({ where: { id: imageId } });
  if (image.isPrimary) {
    const next = await prisma.productImage.findFirst({ where: { productId }, orderBy: { sortOrder: "asc" } });
    if (next) await prisma.productImage.update({ where: { id: next.id }, data: { isPrimary: true } });
  }
  await deletePicture(image.url);
};

const setPrimary = async (productId, imageId) => {
  await ownImage(productId, imageId);
  await prisma.$transaction([
    prisma.productImage.updateMany({ where: { productId }, data: { isPrimary: false } }),
    prisma.productImage.update({ where: { id: imageId }, data: { isPrimary: true } }),
  ]);
};

module.exports = { addImage, removeImage, setPrimary };
