const { getAnalytics, getAnalyticsByUid } = require("./getAnalytics");
const { recordMakeupUsage, getMakeupAnalytics } = require("./makeupAnalytics");

module.exports = {
  getAnalytics,
  getAnalyticsByUid,
  recordMakeupUsage,
  getMakeupAnalytics,
};
