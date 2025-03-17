const { createToken } = require("./createToken");
const { validateToken } = require("./validateToken");
const { getAllTokens, getTokenInfo } = require("./getTokens");
const { updateToken } = require("./updateToken");
const { revokeToken } = require("./revokeToken");

module.exports = {
  createToken,
  validateToken,
  getAllTokens,
  getTokenInfo,
  updateToken,
  revokeToken,
};
