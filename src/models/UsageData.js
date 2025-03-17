// src/models/UsageData.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * @swagger
 * components:
 *   schemas:
 *     UsageData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-incremented ID for the usage data entry
 *         accessTokenUid:
 *           type: string
 *           format: uuid
 *           description: UID of the associated AccessToken
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the request
 *         ip:
 *           type: string
 *           description: IP address of the request
 *         userAgent:
 *           type: string
 *           description: User agent string of the client
 *         country:
 *           type: string
 *           description: Country of the request based on IP
 *         city:
 *           type: string
 *           description: City of the request based on IP
 *         totalRequestCount:
 *           type: integer
 *           description: Total number of requests made with this token at the time of this request
 */

const UsageData = sequelize.define(
  "UsageData",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accessTokenUid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalRequestCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "usage_data",
    timestamps: true,
  }
);

module.exports = UsageData;
