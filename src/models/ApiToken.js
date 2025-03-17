// src/models/ApiToken.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * @swagger
 * components:
 *   schemas:
 *     ApiToken:
 *       type: object
 *       required:
 *         - token
 *         - name
 *         - phoneNumber
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the API token
 *         token:
 *           type: string
 *           description: The actual API token string
 *         name:
 *           type: string
 *           description: The name of the API token owner
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the API token owner
 *         description:
 *           type: string
 *           description: An optional description for the API token
 *         isActive:
 *           type: boolean
 *           description: Indicates whether the API token is active or not
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the API token was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the API token was last updated
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174000
 *         token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         name: John Doe
 *         phoneNumber: "+1234567890"
 *         description: Token for mobile app access
 *         isActive: true
 *         createdAt: "2023-05-20T14:30:00Z"
 *         updatedAt: "2023-05-20T14:30:00Z"
 */

const ApiToken = sequelize.define(
  "ApiToken",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "api_tokens",
    timestamps: true,
  }
);

module.exports = ApiToken;
