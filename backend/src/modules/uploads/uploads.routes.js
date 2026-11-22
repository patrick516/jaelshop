const express = require("express");
const ApiError = require("../../utils/ApiError");
const { sendSuccess } = require("../../utils/ApiResponse");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const { single } = require("../../middleware/upload");
const { uploadBuffer } = require("../../utils/cloudinaryStorage");

const router = express.Router();

// Staff only. Login is checked BEFORE the file is accepted, so strangers cannot use up the storage
router.post("/", authenticate, authorize(), single, async (req, res) => {
  if (!req.file) throw new ApiError(400, "Choose a picture to upload");
  sendSuccess(res, await uploadBuffer(req.file.buffer), "Picture uploaded", 201);
});

module.exports = router;
