// src/models/MakeupUsage.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * @swagger
 * components:
 *   schemas:
 *     MakeupUsage:
 *       type: object
 *       required:
 *         - accessTokenUid
 *         - makeupType
 *         - timestamp
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: The unique identifier for the makeup usage record
 *         accessTokenUid:
 *           type: string
 *           format: uuid
 *           description: The access token UUID associated with this usage
 *         makeupType:
 *           type: string
 *           description: The type of makeup used (lips, eyeshadow, etc.)
 *           enum: [lips, eyeshadow, eyepencil, eyelashes, blush, foundation, brows, highlighter, concealer, eyeliner]
 *         color:
 *           type: string
 *           description: The color used in hex format (e.g. "#FF0000")
 *         colorCode:
 *           type: string
 *           description: The color code used in hex format (e.g. "LP01")
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: When this makeup usage was recorded
 *         device:
 *           type: string
 *           description: The device type used (mobile/desktop)
 *         browser:
 *           type: string
 *           description: The browser used to access the makeup feature
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When this record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When this record was last updated
 *       example:
 *         id: 1
 *         accessTokenUid: "84b30150-1bed-417b-b2ef-032b534d265c"
 *         makeupType: "lips"
 *         color: "#FF0000"
 *         colorCode: "LP01"
 *         pattern: "normal"
 *         transparency: 0.8
 *         timestamp: "2025-01-11T09:26:30.355Z"
 *         device: "mobile"
 *         browser: "Safari"
 *         createdAt: "2025-01-11T09:26:30.356Z"
 *         updatedAt: "2025-01-11T09:26:30.356Z"
 */

const MakeupUsage = sequelize.define(
  "MakeupUsage",
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
    makeupType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    colorCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    device: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    browser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "makeup_usage",
    timestamps: true,
  }
);

module.exports = MakeupUsage;
