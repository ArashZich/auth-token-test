// src/routes/analyticsRoutes.js
const express = require("express");
const {
  getAnalytics,
  getAnalyticsByUid,
  recordMakeupUsage,
  getMakeupAnalytics,
} = require("../controllers/analytics");
const authMiddleware = require("../middleware/authMiddleware");

const analyticsRouter = express.Router();

analyticsRouter.get("/:clientId", authMiddleware, getAnalytics);
analyticsRouter.get("/uid/:uid", getAnalyticsByUid);

analyticsRouter.post("/makeup", recordMakeupUsage);
analyticsRouter.get("/makeup/:clientId", authMiddleware, getMakeupAnalytics);

module.exports = analyticsRouter;
