const { prisma } = require("../config/database");

// Turns the HTTP method into the action word shown on the Activity Logs page
const ACTIONS = {
  POST: "CREATE",
  PUT: "UPDATE",
  PATCH: "UPDATE",
  DELETE: "DELETE",
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Runs for every /api request, but writes a log only for successful changes made by staff
const logActivity = (req, res, next) => {
  // "finish" fires after the response is sent, so logging never slows the request down
  res.on("finish", () => {
    const action = ACTIONS[req.method];
    // skip reads (GET), failed requests, and anyone who is not a logged-in staff member
    if (!action || res.statusCode >= 400 || req.user?.type !== "staff") return;

    // /api/products/<uuid>/adjust becomes ["api", "products", "<uuid>", "adjust"]
    const parts = req.originalUrl.split("?")[0].split("/").filter(Boolean);
    prisma.activityLog
      .create({
        data: {
          userId: req.user.id,
          action,
          entity: parts[1] || "unknown", // the second part is the module name
          entityId: parts.find((p) => UUID.test(p)) || null, // the first id in the URL
          details: { method: req.method, path: req.originalUrl.split("?")[0] },
          ipAddress: req.ip,
        },
      })
      .catch((e) => console.error("Activity log failed:", e.message)); // a log error must never break the app
  });
  next();
};

module.exports = { logActivity };
