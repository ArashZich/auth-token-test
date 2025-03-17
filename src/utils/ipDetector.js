// src/utils/ipDetector.js
const requestIp = require("request-ip");

class IpDetector {
  static getClientIp(req) {
    // اول چک کردن هدر مخصوص
    const realUserIp = req.headers["x-real-user-ip"];
    console.log("X-Real-User-IP header:", realUserIp);

    if (realUserIp) {
      console.log("Using real user IP from header:", realUserIp);
      return realUserIp;
    }

    // اگر هدر مخصوص وجود نداشت، از روش قبلی استفاده کن
    const ip =
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      requestIp.getClientIp(req) ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);

    return IpDetector.normalizeIp(ip);
  }

  static normalizeIp(ip) {
    if (ip) {
      // اگر IP شامل چند آدرس باشد (مثلاً در X-Forwarded-For)، اولین آدرس را برمی‌گرداند
      const ips = ip.split(",");
      return ips[0].trim();
    }
    return null;
  }

  static isLocalhost(ip) {
    return ip === "::1" || ip === "127.0.0.1" || ip === "localhost";
  }

  static logIpWarning(ip) {
    if (IpDetector.isLocalhost(ip)) {
      console.log(
        "Warning: localhost IP detected. This might not be the actual client IP in a production environment."
      );
    }
  }
}

module.exports = IpDetector;
