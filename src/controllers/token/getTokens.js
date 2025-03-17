const tokenService = require("../../services/tokenService");

/**
 * @swagger
 * /all:
 *   get:
 *     summary: Get all tokens
 *     tags: [Tokens]
 *     responses:
 *       200:
 *         description: List of all tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Token'
 */
exports.getAllTokens = async (req, res, next) => {
  try {
    const tokens = await tokenService.getAllTokens();
    res.json(tokens);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /{clientId}:
 *   get:
 *     summary: Get token info for a specific client
 *     tags: [Tokens]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 */
exports.getTokenInfo = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const tokenInfo = await tokenService.getTokenInfo(clientId);
    if (!tokenInfo) {
      return res.status(404).json({ error: "Token not found" });
    }
    res.json(tokenInfo);
  } catch (error) {
    next(error);
  }
};
