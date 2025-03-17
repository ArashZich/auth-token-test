// src/models/AccessToken.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *           format: uuid
 *         clientId:
 *           type: string
 *         token:
 *           type: string
 *         isUnlimited:
 *           type: boolean
 *         durationMonths:
 *           type: integer
 *         monthlyLimit:
 *           type: integer
 *           nullable: true
 *         totalLimit:
 *           type: integer
 *           nullable: true
 *         usageCount:
 *           type: integer
 *         totalRequestCount:
 *           type: integer
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         lastUsedIp:
 *           type: string
 *         lastUsedAt:
 *           type: string
 *           format: date-time
 *         isPremium:
 *           type: boolean
 *         projectType:
 *           type: string
 *         features:
 *           type: object
 *           nullable: true
 *           properties:
 *             allowedFeatures:
 *               type: array
 *               items:
 *                 type: string
 *             allowedPatterns:
 *               type: object
 *             multiFeature:
 *               type: object
 *               properties:
 *                 enabled:
 *                   type: boolean
 *                 maxConcurrent:
 *                   type: integer
 *         mediaFeatures:
 *           type: object
 *           nullable: true
 *           properties:
 *             allowedSources:
 *               type: array
 *               items:
 *                 type: string
 *             allowedViews:
 *               type: array
 *               items:
 *                 type: string
 *             comparisonModes:
 *               type: array
 *               items:
 *                 type: string
 */

const AccessToken = sequelize.define(
  "AccessToken",
  {
    uid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isUnlimited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    durationMonths: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    monthlyLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    usageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalRequestCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lastUsedIp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastUsedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    projectType: {
      type: DataTypes.STRING, // تغییر از ENUM به STRING
      allowNull: false,
      defaultValue: "other",
    },
    features: {
      type: DataTypes.JSONB, // از JSONB برای ذخیره ساختار پیچیده JSON استفاده می‌کنیم
      allowNull: true,
      defaultValue: null,
    },
    mediaFeatures: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "access_tokens",
    timestamps: true,
  }
);

module.exports = AccessToken;
