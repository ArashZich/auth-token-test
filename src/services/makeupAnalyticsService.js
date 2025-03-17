// src/services/makeupAnalyticsService.js
const { AccessToken, MakeupUsage } = require("../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { parseUserAgent } = require("../utils/userAgentUtils");
const config = require("../config/environment");

class MakeupAnalyticsService {
  constructor() {
    // تعریف متغیرهای کلاس
    this.recentMakeupUsages = new Map();
    this.THROTTLE_INTERVAL = 2000; // 2 seconds
    this.CLEANUP_INTERVAL = 10000; // 10 seconds
  }

  // متد کمکی برای پاکسازی موارد قدیمی
  cleanupOldEntries(now) {
    if (now % this.CLEANUP_INTERVAL < 100) {
      for (const [key, timestamp] of this.recentMakeupUsages.entries()) {
        if (now - timestamp > this.CLEANUP_INTERVAL) {
          this.recentMakeupUsages.delete(key);
        }
      }
    }
  }

  async recordMakeupUsage(data) {
    try {
      const decoded = jwt.verify(data.token, config.JWT_SECRET);
      const token = await AccessToken.findOne({
        where: { clientId: decoded.clientId },
      });

      if (!token) {
        throw new Error("Invalid token");
      }

      // اضافه کردن بررسی صحت colorCode
      if (!data.colorCode) {
        const error = new Error("Color code is required");
        error.status = 400;
        throw error;
      }

      // ساخت کلید یکتا برای هر ترکیب با اضافه کردن timestamp
      const usageKey = `${token.uid}-${data.makeupType}-${
        data.colorCode
      }-${Date.now()}`;
      const now = Date.now();

      // کاهش فاصله زمانی throttle
      if (this.recentMakeupUsages.has(usageKey)) {
        const lastUsage = this.recentMakeupUsages.get(usageKey);
        if (now - lastUsage < 500) {
          // کاهش به 500ms
          const error = new Error("Too many similar requests");
          error.status = 429;
          throw error;
        }
      }

      this.recentMakeupUsages.set(usageKey, now);
      this.cleanupOldEntries(now);

      // اعتبارسنجی داده‌های ورودی
      if (!data.makeupType || !data.colorCode) {
        const error = new Error("Makeup type and color code are required");
        error.status = 400;
        throw error;
      }

      const { device, browser } = parseUserAgent(data.userAgent);

      // تبدیل رنگ به فرمت استاندارد اگر لازم باشد
      const color = data.color ? data.color.toUpperCase() : null;

      const usageData = await MakeupUsage.create({
        accessTokenUid: token.uid,
        makeupType: data.makeupType,
        color: color,
        colorCode: data.colorCode,
        timestamp: new Date(),
        device,
        browser,
      });

      return {
        success: true,
        data: usageData,
        message: "Makeup usage recorded successfully",
      };
    } catch (error) {
      console.error("Error recording makeup usage:", error);
      error.status = error.status || 500;
      throw error;
    }
  }

  async getMakeupAnalytics(
    clientIdOrUid,
    period = "all",
    page = 1,
    perPage = 20
  ) {
    try {
      let token = await AccessToken.findOne({ where: { uid: clientIdOrUid } });
      if (!token) {
        token = await AccessToken.findOne({
          where: { clientId: clientIdOrUid },
        });
      }
      if (!token) {
        const error = new Error("Token not found");
        error.status = 404;
        throw error;
      }

      const endDate = new Date();
      let startDate;

      switch (period) {
        case "day":
          startDate = new Date(endDate);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "month":
          startDate = new Date(endDate);
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case "sixMonths":
          startDate = new Date(endDate);
          startDate.setMonth(startDate.getMonth() - 6);
          break;
        default:
          startDate = new Date(0);
      }

      const whereClause = {
        accessTokenUid: token.uid,
        timestamp: {
          [Op.between]: [startDate, endDate],
        },
      };

      const totalCount = await MakeupUsage.count({ where: whereClause });
      const totalPages = Math.ceil(totalCount / perPage);
      const offset = (page - 1) * perPage;

      const usageData = await MakeupUsage.findAll({
        where: whereClause,
        order: [["timestamp", "DESC"]],
        attributes: [
          "makeupType",
          "color",
          "colorCode",
          "timestamp",
          "device",
          "browser",
        ],
        limit: parseInt(perPage),
        offset: parseInt(offset),
      });

      const groupedByType = usageData.reduce((acc, item) => {
        if (!acc[item.makeupType]) acc[item.makeupType] = [];
        acc[item.makeupType].push(item);
        return acc;
      }, {});

      return {
        success: true,
        data: {
          clientId: token.clientId,
          uid: token.uid,
          period,
          totalUsageCount: totalCount,
          pagination: {
            currentPage: parseInt(page),
            perPage: parseInt(perPage),
            totalPages,
            totalCount,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
          usageByType: groupedByType,
          items: usageData,
        },
      };
    } catch (error) {
      console.error("Error getting makeup analytics:", error);
      error.status = error.status || 500;
      throw error;
    }
  }
}

module.exports = new MakeupAnalyticsService();
