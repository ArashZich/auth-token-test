const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.clientIp + ":" + req.path,
  handler: (req, res) => {
    res.status(429).json({
      error: "Rate limit exceeded",
      retryAfter: Math.ceil(limiter.windowMs / 1000 / 60) + " minutes",
    });
  },
});

module.exports = limiter;
