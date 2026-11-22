const { v2: cloudinary } = require("cloudinary");
require("./env"); // loads the .env file first

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const configured = Boolean(cloudName && apiKey && apiSecret);

if (configured) cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });

module.exports = { cloudinary, configured, cloudName };
