const { Prisma } = require("@prisma/client");
const env = require("../config/env");

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500; // default to 500 (server error)
  let message = err.message || "Internal server error";
  let details = err.details || null;

  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    statusCode = 409; // 409 = conflict
    message = `A record with this ${err.meta?.target} already exists`;
  }

  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2025"
  ) {
    statusCode = 404;
    message = "Record not found";
  }

  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2003"
  ) {
    statusCode = 400;
    message = "Related record is missing or still in use";
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401; // 401 = not logged in
    message = "Invalid or expired token";
  }

  // Log real server errors so we can fix them
  if (statusCode >= 500) {
    console.error(err);
  }

  // Send one fixed JSON shape; hide internal error text from clients in production
  res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500 && env.nodeEnv === "production"
        ? "Internal server error"
        : message,
    details,
    ...(env.nodeEnv === "development" && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
