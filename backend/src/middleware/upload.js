const multer = require("multer");
const ApiError = require("../utils/ApiError");

const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// multer only reads the picture out of the upload form. It waits in memory and goes straight to Cloudinary,
// so nothing is saved on this server
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 }, // 10 MB, one picture at a time
  fileFilter: (req, file, cb) => (TYPES.includes(file.mimetype) ? cb(null, true) : cb(new ApiError(400, "Only JPG, PNG, WebP or GIF pictures are allowed"))),
});

// Accepts one picture in the form field "file". Upload problems become clear 400 messages
const single = (req, res, next) =>
  upload.single("file")(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      const message = err.code === "LIMIT_FILE_SIZE" ? "The picture is too big (10 MB at most)" : err.message;
      return next(new ApiError(400, message));
    }
    next(err);
  });

module.exports = { single };
