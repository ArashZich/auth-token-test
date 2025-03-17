// src/middleware/bruteForceProtection.js
const rateLimit = require("express-rate-limit");

const bruteForceProtection = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many failed attempts, please try again later.",
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    return req.clientIp + ":" + req.path; // جداسازی بر اساس IP و مسیر
  },
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many failed attempts from this IP, please try again later.",
      retryAfter:
        Math.ceil(bruteForceProtection.windowMs / 1000 / 60) + " minutes",
    });
  },
});

module.exports = bruteForceProtection;
