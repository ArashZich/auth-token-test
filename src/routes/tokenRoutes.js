// src/routes/tokenRoutes.js
const express = require("express");
const {
  createToken,
  validateToken,
  getAllTokens,
  getTokenInfo,
  updateToken,
  revokeToken,
} = require("../controllers/token");
const authMiddleware = require("../middleware/authMiddleware");

const tokenRouter = express.Router();

tokenRouter.post("/create", authMiddleware, createToken);
tokenRouter.post("/validate", validateToken); // بدون نیاز به احراز هویت
tokenRouter.get("/all", authMiddleware, getAllTokens);
tokenRouter.get("/:clientId", authMiddleware, getTokenInfo);
tokenRouter.put("/:clientId", authMiddleware, updateToken);
tokenRouter.post("/:clientId/revoke", authMiddleware, revokeToken);

module.exports = tokenRouter;
