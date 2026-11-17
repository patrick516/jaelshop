const app = require("./src/app");
const env = require("./src/config/env");
const { connectDB, disconnectDB } = require("./src/config/database");

const start = async () => {
  await connectDB();
  const server = app.listen(env.port, () => {
    console.log(
      `JAEL API running on http://localhost:${env.port} (${env.nodeEnv})`,
    );
  });

  const shutdown = async () => {
    console.log("Shutting down...");
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
