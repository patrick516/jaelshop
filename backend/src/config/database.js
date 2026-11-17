const { PrismaClient } = require("@prisma/client");
const env = require("./env");
const prisma = new PrismaClient({
  // In development also print failed queries and warnings, in production only errors
  log: env.nodeEnv === "development" ? ["warn", "error"] : ["error"],
});

// Opens the connection and fails early if the database is unreachable
const connectDB = async () => {
  await prisma.$connect(); // try to connect now
  console.log("PostgreSQL connected (jaelshop)");
};

// Closes the connection cleanly, used when the server shuts down
const disconnectDB = async () => {
  await prisma.$disconnect();
};

module.exports = { prisma, connectDB, disconnectDB };
