// src/models/index.js
const AccessToken = require("./AccessToken");
const UsageData = require("./UsageData");
const ApiToken = require("./ApiToken");
const MakeupUsage = require("./MakeupUsage");

AccessToken.hasMany(UsageData, {
  foreignKey: "accessTokenUid",
  sourceKey: "uid",
});
UsageData.belongsTo(AccessToken, {
  foreignKey: "accessTokenUid",
  targetKey: "uid",
});

module.exports = {
  AccessToken,
  UsageData,
  ApiToken,
  MakeupUsage,
};
