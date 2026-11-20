const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const ApiError = require("../utils/ApiError");

// Pictures are saved in backend/uploads
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// The file ending comes from the picture type, never from the name the visitor sent
const TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) =>
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${TYPES[file.mimetype]}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 }, // 10 MB, one picture at a time
  fileFilter: (req, file, cb) =>
    TYPES[file.mimetype]
      ? cb(null, true)
      : cb(new ApiError(400, "Only JPG, PNG, WebP or GIF pictures are allowed")),
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

module.exports = { single, UPLOAD_DIR };
