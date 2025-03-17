// src/controllers/token/updateToken.js

const tokenService = require("../../services/tokenService");

/**
 * @swagger
 * components:
 *   schemas:
 *     AccessToken:
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
 *           properties:
 *             allowedFeatures:
 *               type: array
 *               items:
 *                 type: string
 *                 enum: [lips, eyeshadow, eyepencil, eyelashes, blush, foundation, brows, highlighter, concealer, eyeliner]
 *             allowedPatterns:
 *               type: object
 *               additionalProperties:
 *                 type: array
 *                 items:
 *                   type: string
 *               example:
 *                 lips: [normal, matte, glossy]
 *                 eyeshadow: [natural, smokey]
 *             multiFeature:
 *               type: object
 *               properties:
 *                 enabled:
 *                   type: boolean
 *                 maxConcurrent:
 *                   type: integer
 *         mediaFeatures:
 *           type: object
 *           properties:
 *             allowedSources:
 *               type: array
 *               items:
 *                 type: string
 *                 enum: [camera, image]
 *             allowedViews:
 *               type: array
 *               items:
 *                 type: string
 *                 enum: [live, comparison]
 *             comparisonModes:
 *               type: array
 *               items:
 *                 type: string
 *                 enum: [before-after, split]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 * /{clientId}:
 *   put:
 *     summary: Update token for a specific client
 *     tags: [Tokens]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               additionalRequests:
 *                 type: integer
 *               newMonthlyLimit:
 *                 type: integer
 *               additionalMonths:
 *                 oneOf:
 *                   - type: integer
 *                     description: Number of months to add (e.g. 12)
 *                   - type: string
 *                     format: date
 *                     description: Specific expiration date (e.g. "2025-11-20")
 *               isUnlimited:
 *                 type: boolean
 *               isPremium:
 *                 type: boolean
 *               projectType:
 *                 type: string
 *                 enum: [web, mobile, desktop, makeup, other]
 *               features:
 *                 type: object
 *                 properties:
 *                   allowedFeatures:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [lips, eyeshadow, eyepencil, eyelashes, blush, foundation, brows, highlighter, concealer, eyeliner]
 *                   allowedPatterns:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: string
 *                     example:
 *                       lips: [normal, matte, glossy]
 *                       eyeshadow: [natural, smokey]
 *                   multiFeature:
 *                     type: object
 *                     properties:
 *                       enabled:
 *                         type: boolean
 *                       maxConcurrent:
 *                         type: integer
 *               mediaFeatures:
 *                 type: object
 *                 properties:
 *                   allowedSources:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [camera, image]
 *                   allowedViews:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [live, comparison]
 *                   comparisonModes:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [before-after, split]
 *     responses:
 *       200:
 *         description: Updated token information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccessToken'
 *       400:
 *         description: Bad request - Invalid input data
 *       404:
 *         description: Token not found
 */
exports.updateToken = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const updateData = req.body;

    // بررسی اعتبار داده‌های ورودی
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: "No data provided for update",
      });
    }

    const updatedToken = await tokenService.updateToken(clientId, updateData);

    if (!updatedToken) {
      return res.status(404).json({
        error: "Token not found",
      });
    }

    res.json(updatedToken);
  } catch (error) {
    console.error("Error in updateToken:", error);
    next(error);
  }
};
