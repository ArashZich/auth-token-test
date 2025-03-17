// src/controllers/token/validateToken.js
const tokenService = require("../../services/tokenService");

/**
 * @swagger
 * /validate:
 *   post:
 *     summary: Validate a token
 *     tags: [Tokens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isValid:
 *                   type: boolean
 *                   description: Whether the token is valid
 *                 isPremium:
 *                   type: boolean
 *                   description: Premium status of the token
 *                 projectType:
 *                   type: string
 *                   description: Type of project (web, mobile, desktop, makeup, other)
 *                 userId:
 *                   type: string
 *                   description: Client ID or UID associated with the token
 *                 features:
 *                   type: object
 *                   description: Available features configuration
 *                   properties:
 *                     allowedFeatures:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of allowed makeup features
 *                     allowedPatterns:
 *                       type: object
 *                       description: Patterns allowed for each feature
 *                     multiFeature:
 *                       type: object
 *                       properties:
 *                         enabled:
 *                           type: boolean
 *                         maxConcurrent:
 *                           type: integer
 *                 mediaFeatures:
 *                   type: object
 *                   description: Media-related features configuration
 *                   properties:
 *                     allowedSources:
 *                       type: array
 *                       items:
 *                         type: string
 *                     allowedViews:
 *                       type: array
 *                       items:
 *                         type: string
 *                     comparisonModes:
 *                       type: array
 *                       items:
 *                         type: string
 *             example:
 *               isValid: true
 *               isPremium: false
 *               projectType: "makeup"
 *               userId: "client123"
 *               features:
 *                 allowedFeatures: ["lips", "eyeshadow", "eyepencil"]
 *                 allowedPatterns:
 *                   lips: ["normal", "matte", "glossy"]
 *                   eyeshadow: ["natural", "smokey"]
 *                 multiFeature:
 *                   enabled: true
 *                   maxConcurrent: 3
 *               mediaFeatures:
 *                 allowedSources: ["camera", "image"]
 *                 allowedViews: ["live", "comparison"]
 *                 comparisonModes: ["before-after", "split"]
 *       400:
 *         description: Token is required or invalid
 */
exports.validateToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const validationResult = await tokenService.validateToken(token, req, res);
    console.log("Token validation result:", validationResult);
    res.json(validationResult);
  } catch (error) {
    next(error);
  }
};
