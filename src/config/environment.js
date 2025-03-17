const dotenv = require("dotenv");
const path = require("path");

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: path.join(__dirname, "..", "..", envFile) });

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3306,
  API_BASE_URL:
    process.env.API_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://sdk-token.armogroup.tech/api/v1"
      : `http://localhost:${process.env.PORT || 3306}/api/v1`),
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_SSL_MODE: process.env.DATABASE_SSL_MODE,
  JWT_SECRET: process.env.JWT_SECRET,
  VERSION: process.env.VERSION,
  RESET_DB: process.env.RESET_DB === "true",
  SWAGGER_USERNAME: process.env.SWAGGER_USERNAME,
  SWAGGER_PASSWORD: process.env.SWAGGER_PASSWORD,
  API_SECRET: process.env.API_SECRET,
};
