const express = require("express");
const cors = require("cors");
const config = require("./config/environment");
const { initializeDatabase } = require("./config/database");
const routes = require("./routes");
const limiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const { logger, loggerMiddleware } = require("./utils/logger");
const IpDetector = require("./utils/ipDetector");
const swagger = require("./config/swagger");
const bruteForceProtection = require("./middleware/bruteForceProtection");

const app = express();

function logAppInfo() {
  logger.info(`Running version: ${config.VERSION}`);
  logger.info(`Environment: ${config.NODE_ENV}`);
  logger.info(`Reset DB: ${config.RESET_DB}`);
}

function setupMiddleware() {
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: "*", // یا آدرس‌های مشخص
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "X-Real-User-IP"], // اضافه کردن هدر سفارشی
    })
  );
  app.use((req, res, next) => {
    req.clientIp = IpDetector.getClientIp(req);
    logger.debug(`Client IP: ${req.clientIp}`);
    IpDetector.logIpWarning(req.clientIp);
    next();
  });
  app.use(limiter);
  app.use(bruteForceProtection);
  app.use(express.json());
  app.use(loggerMiddleware);
}

function setupRoutes() {
  app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ status: "OK", environment: config.NODE_ENV });
  });

  app.use("/api/v1", routes);

  // Add swagger authentication to swagger.json route
  app.get("/api-docs/swagger.json", swagger.swaggerAuth, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swagger.specs);
  });

  app.use("/api-docs", swagger.swaggerAuth, swagger.serve, swagger.setup);
}

function logRegisteredRoutes() {
  logger.info("Registered routes:");
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      logger.info(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
  });
}

async function startApp() {
  try {
    logAppInfo();
    await initializeDatabase();
    setupMiddleware();
    setupRoutes();
    logRegisteredRoutes();
    app.use(errorHandler);

    app.listen(config.PORT, () => {
      logger.info(`Token API server running on port ${config.PORT}`);
      logger.info(
        `Swagger UI available at http://localhost:${config.PORT}/api-docs`
      );
      logger.info(
        `OpenAPI JSON available at http://localhost:${config.PORT}/api-docs/swagger.json`
      );
    });
  } catch (error) {
    logger.error("Failed to start the application:", error);
    process.exit(1);
  }
}

startApp();

module.exports = { app };
