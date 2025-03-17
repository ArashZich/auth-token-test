// src/controllers/analytics/makeupAnalytics.js
const { parseUserAgent } = require("../../utils/userAgentUtils");
const makeupAnalyticsService = require("../../services/makeupAnalyticsService");

/**
 * @swagger
 * /analytics/makeup:
 *   post:
 *     summary: Record makeup usage analytics
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - makeupType
 *             properties:
 *               token:
 *                 type: string
 *               makeupType:
 *                 type: string
 *                 enum: [lips, eyeshadow, eyepencil, eyelashes, blush, foundation, brows, highlighter, concealer, eyeliner]
 *               color:
 *                 type: string
 *                 description: The color used in hex format (e.g. "#FF0000")
 *               colorCode:
 *                 type: string
 *                 description: The color code (e.g. "LP01")
 *     responses:
 *       200:
 *         description: Makeup usage recorded successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Invalid token
 */
exports.recordMakeupUsage = async (req, res, next) => {
  try {
    const { token, makeupType, color, colorCode } = req.body;
    const userAgent = req.headers["user-agent"];

    if (!token || !makeupType) {
      return res
        .status(400)
        .json({ error: "Token and makeupType are required" });
    }

    const result = await makeupAnalyticsService.recordMakeupUsage({
      token,
      makeupType,
      color,
      colorCode, // اضافه کردن colorCode
      userAgent, // اضافه کردن userAgent به پارامترهای ارسالی
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /analytics/makeup/{clientId}:
 *   get:
 *     summary: Get makeup usage analytics for a client
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, all]
 *           default: all
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 20
 *         description: The number of items per page for pagination
 *     responses:
 *       200:
 *         description: Makeup usage analytics data
 *       404:
 *         description: Client not found
 */
exports.getMakeupAnalytics = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { period = "all", page = 1, perPage = 20 } = req.query;

    const analytics = await makeupAnalyticsService.getMakeupAnalytics(
      clientId,
      period,
      parseInt(page),
      parseInt(perPage)
    );

    res.json(analytics);
  } catch (error) {
    next(error);
  }
};
