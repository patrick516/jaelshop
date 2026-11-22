const { cloudinary, configured, cloudName } = require("../config/cloudinary");
const ApiError = require("./ApiError");

const FOLDER = "jael-products"; // the Media Library folder made for the shop
const OPTIONS = {
  folder: FOLDER,
  resource_type: "image",
  allowed_formats: ["jpg", "png", "webp", "gif"],
};

// The saved address asks Cloudinary for the best format and quality for each visitor's phone
const optimized = (secureUrl) =>
  secureUrl.replace("/upload/", "/upload/f_auto,q_auto/");

const toPicture = (r) => ({
  url: optimized(r.secure_url),
  publicId: r.public_id,
});

const ready = () => {
  if (!configured)
    throw new ApiError(
      500,
      "Picture storage is not set up. Check the CLOUDINARY_ settings",
    );
};

// The real reason is written to the server log. The visitor only sees a short message
const fail = (err) => {
  console.error("Cloudinary error:", err?.message ?? err);
  throw new ApiError(502, "Could not store the picture. Please try again");
};

const uploadBuffer = (buffer, folder = FOLDER) => {
  ready();
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ ...OPTIONS, folder }, (err, result) =>
        err ? reject(err) : resolve(result),
      )
      .end(buffer);
  }).then(toPicture, fail);
};

// Uploads a picture saved on this computer (used when moving the old pictures)
const uploadFile = (filePath) => {
  ready();
  return cloudinary.uploader.upload(filePath, OPTIONS).then(toPicture, fail);
};

// The public id of a picture in OUR Cloudinary account, or null for any other address
const publicIdFromUrl = (url) => {
  const m = String(url).match(
    /^https:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(?:[^/]+\/)*?v\d+\/([^?#]+?)(?:\.[a-z0-9]+)?(?:[?#].*)?$/i,
  );
  return m && m[1] === cloudName ? m[2] : null;
};

// Deletes a picture from Cloudinary. Other addresses are ignored, and a failed delete never blocks the admin
const deletePicture = async (url) => {
  const publicId = publicIdFromUrl(url);
  if (!publicId || !configured) return;
  try {
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (err) {
    console.error("Cloudinary delete failed:", err?.message ?? err);
  }
};

module.exports = { uploadBuffer, uploadFile, publicIdFromUrl, deletePicture };
