const UAParser = require("ua-parser-js");

/**
 * Get device information from user agent
 * @param {Object} parsedUA - Parsed user agent object
 * @returns {string} Device type
 */
function getDeviceInfo(parsedUA) {
  // ابتدا سیستم عامل را چک می‌کنیم
  const os = parsedUA.os.name?.toLowerCase() || "";
  const deviceType = parsedUA.device.type?.toLowerCase() || "";
  const model = parsedUA.device.model?.toLowerCase() || "";

  // اول چک کردن سیستم عامل‌های دسکتاپ
  if (os.includes("mac") || os === "macos") {
    return "mac";
  }
  if (os.includes("windows")) {
    return "windows";
  }
  if (os.includes("linux") && !os.includes("android")) {
    return "linux";
  }

  // سپس چک کردن موبایل و تبلت
  if (deviceType === "mobile" || deviceType === "tablet" || model) {
    if (os.includes("ios") || os.includes("iphone") || os.includes("ipad")) {
      return "iphone";
    }
    if (os.includes("android")) {
      return "android";
    }
    return "mobile";
  }

  // در نهایت اگر هیچکدام نبود، به عنوان desktop در نظر می‌گیریم
  return "desktop";
}

/**
 * Get browser information from user agent
 * @param {Object} parsedUA - Parsed user agent object
 * @returns {string} Browser name
 */
function getBrowserInfo(parsedUA) {
  const browserName = parsedUA.browser.name?.toLowerCase() || "";

  if (browserName.includes("chrome")) {
    if (browserName.includes("chrome mobile")) return "Chrome Mobile";
    return "Chrome";
  }
  if (browserName.includes("firefox")) {
    if (browserName.includes("firefox mobile")) return "Firefox Mobile";
    return "Firefox";
  }
  if (browserName.includes("safari")) {
    if (browserName.includes("chrome")) return "Chrome"; // چون بعضی مرورگرها Safari را هم در UA دارند
    if (browserName.includes("mobile")) return "Safari Mobile";
    return "Safari";
  }
  if (browserName.includes("edge")) return "Edge";
  if (browserName.includes("ie") || browserName.includes("internet explorer"))
    return "IE";
  if (browserName.includes("opera")) {
    if (browserName.includes("opera mobile")) return "Opera Mobile";
    return "Opera";
  }
  if (browserName.includes("samsung")) return "Samsung Browser";
  if (browserName.includes("ucbrowser")) return "UC Browser";

  return "Unknown";
}

/**
 * Parse user agent string
 * @param {string} userAgent - User agent string
 * @returns {Object} Parsed information containing device and browser
 */
function parseUserAgent(userAgent) {
  if (!userAgent) {
    console.warn("No user agent provided");
    return {
      device: "unknown",
      browser: "unknown",
    };
  }
  const parser = new UAParser(userAgent);
  const parsedUA = parser.getResult();

  const deviceInfo = getDeviceInfo(parsedUA);
  const browserInfo = getBrowserInfo(parsedUA);

  return {
    device: deviceInfo,
    browser: browserInfo,
  };
}

module.exports = {
  getDeviceInfo,
  getBrowserInfo,
  parseUserAgent,
};
