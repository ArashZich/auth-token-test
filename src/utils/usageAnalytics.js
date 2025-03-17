const geoip = require("geoip-lite");

function collectUsageData(req, res, startTime) {
  const usageData = {
    timestamp: new Date().toISOString(),
    ip: req.clientIp,
    userAgent: req.headers["user-agent"],
    ...getGeoData(req.clientIp),
  };

  console.log("Collected usage data:", usageData);
  return usageData;
}

function getGeoData(ip) {
  const geo = geoip.lookup(ip);
  return geo
    ? {
        country: geo.country,
        city: geo.city,
      }
    : {
        country: null,
        city: null,
      };
}

module.exports = { collectUsageData };
