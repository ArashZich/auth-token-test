// src/controllers/analytics/getAnalytics.js

const analyticsService = require("../../services/analyticsService");

/**
 * @swagger
 * components:
 *   schemas:
 *     UsageData:
 *       type: object
 *       properties:
 *         timestamp:
 *           type: string
 *           format: date-time
 *         ip:
 *           type: string
 *         userAgent:
 *           type: string
 *         country:
 *           type: string
 *         city:
 *           type: string
 *         totalRequestCount:
 *           type: integer
 *
 *     AnalyticsResponse:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *           format: uuid
 *         clientId:
 *           type: string
 *         period:
 *           type: string
 *           enum: [week, month, sixMonths, all]
 *         totalRequestCount:
 *           type: integer
 *         currentUsageCount:
 *           type: integer
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UsageData'
 *         pagination:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: integer
 *             pageSize:
 *               type: integer
 *             totalPages:
 *               type: integer
 *             totalCount:
 *               type: integer
 *         tokenInfo:
 *           type: object
 *           properties:
 *             isUnlimited:
 *               type: boolean
 *             monthlyLimit:
 *               type: integer
 *               nullable: true
 *             durationMonths:
 *               type: integer
 *             expiresAt:
 *               type: string
 *               format: date-time
 *             isPremium:
 *               type: boolean
 *             projectType:
 *               type: string
 */

/**
 * @swagger
 * /analytics/{clientId}:
 *   get:
 *     summary: Get analytics data for a specific client
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: The client ID for which to retrieve analytics
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, sixMonths, all]
 *           default: all
 *         description: The time period for which to retrieve analytics
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved analytics data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsResponse'
 *       400:
 *         description: Bad request (e.g., invalid parameters)
 *       404:
 *         description: Client ID not found
 *       500:
 *         description: Internal server error
 */

exports.getAnalytics = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { period = "all", page = 1, pageSize = 20 } = req.query;

    const analytics = await analyticsService.getAnalytics(
      clientId,
      period,
      parseInt(page),
      parseInt(pageSize)
    );

    res.json(analytics);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /analytics/uid/{uid}:
 *   get:
 *     summary: Get analytics data for a specific token UID
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: The token UID for which to retrieve analytics
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, sixMonths, all]
 *           default: all
 *         description: The time period for which to retrieve analytics
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved analytics data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsResponse'
 *       400:
 *         description: Bad request (e.g., invalid parameters)
 *       404:
 *         description: Token UID not found
 *       500:
 *         description: Internal server error
 */
exports.getAnalyticsByUid = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const { period = "all", page = 1, pageSize = 20 } = req.query;

    const analytics = await analyticsService.getAnalyticsByUid(
      uid,
      period,
      parseInt(page),
      parseInt(pageSize)
    );

    res.json(analytics);
  } catch (error) {
    next(error);
  }
};
