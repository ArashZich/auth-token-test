// src/config/database.js
const { Sequelize } = require("sequelize");
const config = require("./environment");

const sequelize = new Sequelize(
  config.DATABASE_NAME,
  config.DATABASE_USERNAME,
  config.DATABASE_PASSWORD,
  {
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl:
        config.DATABASE_SSL_MODE === "require"
          ? { require: true, rejectUnauthorized: false }
          : false,
    },
  }
);

async function createDatabaseIfNotExists() {
  const tempSequelize = new Sequelize(
    "postgres",
    config.DATABASE_USERNAME,
    config.DATABASE_PASSWORD,
    {
      host: config.DATABASE_HOST,
      port: config.DATABASE_PORT,
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl:
          config.DATABASE_SSL_MODE === "require"
            ? { require: true, rejectUnauthorized: false }
            : false,
      },
    }
  );

  try {
    await tempSequelize.query(`CREATE DATABASE ${config.DATABASE_NAME};`);
    console.log(`Database ${config.DATABASE_NAME} created successfully.`);
  } catch (error) {
    if (error.parent.code === "42P04") {
      console.log(`Database ${config.DATABASE_NAME} already exists.`);
    } else {
      throw error;
    }
  } finally {
    await tempSequelize.close();
  }
}

async function resetDatabase() {
  try {
    await sequelize.getQueryInterface().dropAllTables();
    console.log("All tables have been dropped.");
    await sequelize.sync({ force: true });
    console.log("Database has been reset and all tables have been recreated.");
  } catch (error) {
    console.error("Error resetting the database:", error);
    process.exit(1);
  }
}

async function initializeDatabase() {
  try {
    await createDatabaseIfNotExists();
    await sequelize.authenticate();
    console.log("Connection to PostgreSQL has been established successfully.");

    const { AccessToken, UsageData } = require("../models");

    const tables = await sequelize.getQueryInterface().showAllTables();

    if (tables.length === 0 || config.RESET_DB) {
      if (config.RESET_DB) {
        console.log("Reset database flag is set. Resetting the database...");
      } else {
        console.log("No tables found. Creating tables...");
      }
      await resetDatabase();
    } else {
      console.log("Tables already exist. Syncing models...");
      await sequelize.sync({ alter: true });
      console.log("All models were synchronized successfully.");
    }

    // Establish relationships
    AccessToken.hasMany(UsageData, {
      foreignKey: "accessTokenUid",
      sourceKey: "uid",
    });
    UsageData.belongsTo(AccessToken, {
      foreignKey: "accessTokenUid",
      targetKey: "uid",
    });
  } catch (error) {
    console.error("Unable to initialize the database:", error);
    process.exit(1);
  }
}

module.exports = { sequelize, initializeDatabase };
