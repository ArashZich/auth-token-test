const jwt = require("jsonwebtoken");
const config = require("../config/environment");
const { ApiToken } = require("../models");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.API_SECRET);
    if (decoded.type !== "api_access") {
      throw new Error("Invalid token type");
    }

    const apiToken = await ApiToken.findOne({
      where: { token, isActive: true },
    });
    if (!apiToken) {
      throw new Error("Token is not active or does not exist");
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = authMiddleware;
