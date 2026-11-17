require("dotenv").config({ quiet: true });

// Variables the app cannot run without
const required = ["DATABASE_URL", "JWT_SECRET"];

// Collect the names of any required variables that are missing or empty
const missing = required.filter((name) => !process.env[name]);

// Stop the app immediately with a clear message instead of failing later in a confusing way
if (missing.length > 0) {
  console.error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
  process.exit(1);
}

// One clean object the rest of the code imports instead of reading process.env directly
const env = {
  nodeEnv: process.env.NODE_ENV || "development", // default to development
  port: Number(process.env.PORT) || 5000, // convert the text "5000" to a number
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  // Turn "a,b" into ["a","b"], trimming spaces and dropping empty entries
  corsOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

// Make the object available to other files with require('../config/env')
module.exports = env;
