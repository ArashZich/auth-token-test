// src/controllers/apiAuth/apiTokenController.js
const apiTokenService = require("../../services/apiTokenService");

/**
 * @swagger
 * components:
 *   schemas:
 *     ApiToken:
 *       type: object
 *       required:
 *         - name
 *         - phoneNumber
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         description:
 *           type: string
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: API Authentication
 *   description: API authentication management
 */

/**
 * @swagger
 * /api-auth/create-token:
 *   post:
 *     summary: Create a new API access token
 *     tags: [API Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phoneNumber
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: API Token created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiToken'
 *       400:
 *         description: Invalid request parameters
 */
exports.createApiToken = async (req, res, next) => {
  try {
    const { name, phoneNumber, description } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({
        error: "Name and phone number are required for API token",
      });
    }

    const apiToken = await apiTokenService.createApiToken(
      name,
      phoneNumber,
      description
    );
    res.json(apiToken);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api-auth/tokens:
 *   get:
 *     summary: Get all API tokens
 *     tags: [API Authentication]
 *     responses:
 *       200:
 *         description: List of all API tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ApiToken'
 */
exports.getApiTokens = async (req, res, next) => {
  try {
    const tokens = await apiTokenService.getApiTokens();
    res.json(tokens);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api-auth/deactivate/{id}:
 *   post:
 *     summary: Deactivate an API token
 *     tags: [API Authentication]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The API token ID
 *     responses:
 *       200:
 *         description: API Token deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiToken'
 *       404:
 *         description: API Token not found
 */
exports.deactivateApiToken = async (req, res, next) => {
  try {
    const { id } = req.params;
    const apiToken = await apiTokenService.deactivateApiToken(id);
    res.json(apiToken);
  } catch (error) {
    if (error.message === "API token not found") {
      return res.status(404).json({ error: "API token not found" });
    }
    next(error);
  }
};
