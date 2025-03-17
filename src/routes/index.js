// src/routes/index.js
const express = require("express");
const tokenRoutes = require("./tokenRoutes");
const analyticsRoutes = require("./analyticsRoutes");
const apiAuthRoutes = require("./apiAuthRoutes");

const router = express.Router();

router.use("/", tokenRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/api-auth", apiAuthRoutes);

module.exports = router;
