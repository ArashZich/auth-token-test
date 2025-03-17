const tokenService = require("../../services/tokenService");

/**
 * @swagger
 * /{clientId}/revoke:
 *   post:
 *     summary: Revoke token for a specific client
 *     tags: [Tokens]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token revoked successfully
 *       404:
 *         description: Token not found
 */
exports.revokeToken = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const result = await tokenService.revokeToken(clientId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
