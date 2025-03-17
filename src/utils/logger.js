const winston = require("winston");
const path = require("path");
const config = require("../config/environment");

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} ${level}: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += " " + JSON.stringify(metadata);
  }
  return msg;
});

let transportOptions;

if (config.NODE_ENV === "production") {
  transportOptions = [
    new transports.Console({
      format: combine(colorize(), myFormat),
    }),
  ];
} else {
  transportOptions = [
    new transports.Console({
      format: combine(colorize(), myFormat),
    }),
    new transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(__dirname, "../../logs/combined.log"),
    }),
  ];
}

const logger = createLogger({
  level: config.NODE_ENV === "production" ? "info" : "debug",
  format: combine(timestamp(), myFormat),
  transports: transportOptions,
});

const loggerMiddleware = (req, res, next) => {
  const startHrTime = process.hrtime();

  res.on("finish", () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    logger.info("HTTP Request", {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: elapsedTimeInMs.toFixed(3) + "ms",
      body: req.body,
      timestamp: new Date().toISOString(),
    });
  });

  next();
};

module.exports = { logger, loggerMiddleware };
