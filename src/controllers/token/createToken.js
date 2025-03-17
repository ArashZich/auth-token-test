// src/controllers/createToken.js
const tokenService = require("../../services/tokenService");
const { getClientIp } = require("../../utils/ipDetector");

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new token
 *     tags: [Tokens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - durationMonths
 *             properties:
 *               clientId:
 *                 type: string
 *                 description: Unique identifier for the client
 *               monthlyLimit:
 *                 type: integer
 *                 description: Monthly request limit (not required if isUnlimited is true)
 *               durationMonths:
 *                 type: integer
 *                 description: Duration of token validity in months
 *               isUnlimited:
 *                 type: boolean
 *                 default: false
 *                 description: If true, token has no request limits
 *               isPremium:
 *                 type: boolean
 *                 default: false
 *                 description: Premium features access flag
 *               projectType:
 *                 type: string
 *                 enum: [web, mobile, desktop, makeup, other]
 *                 default: other
 *                 description: Type of project using the token
 *               features:
 *                 type: object
 *                 description: Specific features configuration (optional)
 *                 properties:
 *                   allowedFeatures:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [lips, eyeshadow, eyepencil, eyeliner, eyelashes, blush, brows, concealer, foundation, highlighter]
 *                     description: List of allowed makeup features
 *                   allowedPatterns:
 *                     type: object
 *                     description: Allowed patterns for each feature
 *                     example:
 *                       lips: ["normal", "matte", "glossy", "glitter"]
 *                       eyeshadow: ["natural", "smokey"]
 *                       foundation: ["matte", "dewy", "natural"]
 *                   multiFeature:
 *                     type: object
 *                     properties:
 *                       enabled:
 *                         type: boolean
 *                         description: Enable multiple features simultaneously
 *                       maxConcurrent:
 *                         type: integer
 *                         description: Maximum number of concurrent features
 *               mediaFeatures:
 *                 type: object
 *                 description: Media-related features configuration (optional)
 *                 properties:
 *                   allowedSources:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [camera, image]
 *                     description: Allowed media source types
 *                   allowedViews:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [live, comparison]
 *                     description: Allowed view modes
 *                   comparisonModes:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [before-after, split]
 *                     description: Allowed comparison modes
 *           example:
 *             clientId: "client123"
 *             monthlyLimit: 1000
 *             durationMonths: 12
 *             isUnlimited: false
 *             isPremium: true
 *             projectType: "makeup"
 *             features:
 *               allowedFeatures: ["lips", "eyeshadow", "blush"]
 *               allowedPatterns:
 *                 lips: ["normal", "matte", "glossy"]
 *                 eyeshadow: ["natural", "smokey"]
 *               multiFeature:
 *                 enabled: true
 *                 maxConcurrent: 3
 *             mediaFeatures:
 *               allowedSources: ["camera", "image"]
 *               allowedViews: ["live", "comparison"]
 *               comparisonModes: ["before-after", "split"]
 *     responses:
 *       200:
 *         description: Token created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The generated JWT token
 *       400:
 *         description: Invalid request parameters
 */

exports.createToken = async (req, res, next) => {
  try {
    const {
      clientId,
      monthlyLimit,
      durationMonths,
      isUnlimited,
      isPremium,
      projectType,
      features,
      mediaFeatures,
    } = req.body;
    const ipAddress = getClientIp(req);

    // Validation
    if (!clientId || !durationMonths || durationMonths <= 0) {
      return res.status(400).json({
        error: "clientId and durationMonths (positive number) are required",
      });
    }

    if (isUnlimited === true) {
      const token = await tokenService.createToken(
        clientId,
        null,
        durationMonths,
        ipAddress,
        true,
        isPremium,
        projectType,
        features,
        mediaFeatures
      );
      return res.json({ token });
    }

    if (!monthlyLimit || monthlyLimit <= 0) {
      return res.status(400).json({
        error: "For limited tokens, monthlyLimit must be a positive number",
      });
    }

    const token = await tokenService.createToken(
      clientId,
      monthlyLimit,
      durationMonths,
      ipAddress,
      false,
      isPremium,
      projectType,
      features,
      mediaFeatures
    );
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
