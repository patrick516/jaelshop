const service = require("./customers.service");
const { sendSuccess, sendPaginated } = require("../../utils/ApiResponse");

// req.user.id is the logged-in customer (set by authenticate)

const list = async (req, res) => {
  const { items, page, limit, total } = await service.list(req.query);
  sendPaginated(res, items, page, limit, total);
};
const getOne = async (req, res) =>
  sendSuccess(res, await service.getById(req.params.id));
const updateStatus = async (req, res) =>
  sendSuccess(
    res,
    await service.updateStatus(req.params.id, req.body.status),
    "Customer status updated",
  );

const getProfile = async (req, res) =>
  sendSuccess(res, await service.getProfile(req.user.id));
const updateProfile = async (req, res) =>
  sendSuccess(
    res,
    await service.updateProfile(req.user.id, req.body),
    "Profile updated",
  );

const listAddresses = async (req, res) =>
  sendSuccess(res, await service.listAddresses(req.user.id));
const createAddress = async (req, res) =>
  sendSuccess(
    res,
    await service.createAddress(req.user.id, req.body),
    "Address added",
    201,
  );
const updateAddress = async (req, res) =>
  sendSuccess(
    res,
    await service.updateAddress(req.user.id, req.params.id, req.body),
    "Address updated",
  );
const deleteAddress = async (req, res) => {
  await service.deleteAddress(req.user.id, req.params.id);
  sendSuccess(res, null, "Address deleted");
};

const listWishlist = async (req, res) =>
  sendSuccess(res, await service.listWishlist(req.user.id));
const addWishlist = async (req, res) => {
  await service.addWishlist(req.user.id, req.params.productId);
  sendSuccess(res, null, "Added to wishlist", 201);
};
const removeWishlist = async (req, res) => {
  await service.removeWishlist(req.user.id, req.params.productId);
  sendSuccess(res, null, "Removed from wishlist");
};

module.exports = {
  list,
  getOne,
  updateStatus,
  getProfile,
  updateProfile,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  listWishlist,
  addWishlist,
  removeWishlist,
};
