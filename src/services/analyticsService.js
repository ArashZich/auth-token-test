// src/services/analyticsService.js
const { AccessToken, UsageData } = require("../models");
const { Op } = require("sequelize");

class AnalyticsService {
  async getAnalytics(clientId, period = "all", page = 1, pageSize = 20) {
    try {
      const token = await AccessToken.findOne({ where: { clientId } });
      if (!token) {
        throw new Error("Token not found");
      }

      console.log("Token found:", token.toJSON());

      return this._getAnalyticsData(token, period, page, pageSize);
    } catch (error) {
      console.error("Error in getAnalytics:", error);
      throw error;
    }
  }

  async getAnalyticsByUid(uid, period = "all", page = 1, pageSize = 20) {
    try {
      const token = await AccessToken.findOne({ where: { uid } });
      if (!token) {
        throw new Error("Token not found");
      }

      console.log("Token found:", token.toJSON());

      return this._getAnalyticsData(token, period, page, pageSize);
    } catch (error) {
      console.error("Error in getAnalyticsByUid:", error);
      throw error;
    }
  }

  async _getAnalyticsData(token, period, page, pageSize) {
    let startDate;
    const endDate = new Date();

    switch (period) {
      case "week":
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(
          endDate.getFullYear(),
          endDate.getMonth() - 1,
          endDate.getDate()
        );
        break;
      case "sixMonths":
        startDate = new Date(
          endDate.getFullYear(),
          endDate.getMonth() - 6,
          endDate.getDate()
        );
        break;
      case "all":
      default:
        startDate = new Date(0); // From the beginning of time
    }

    const { count, rows } = await UsageData.findAndCountAll({
      where: {
        accessTokenUid: token.uid,
        timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["timestamp", "DESC"]],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);

    // Calculate current usage count
    const currentUsageCount = await UsageData.count({
      where: {
        accessTokenUid: token.uid,
        timestamp: {
          [Op.gte]: new Date(new Date().setDate(1)), // First day of current month
        },
      },
    });

    return {
      uid: token.uid,
      clientId: token.clientId,
      period,
      totalRequestCount: token.totalRequestCount,
      currentUsageCount,
      data: rows,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalCount: count,
      },
      tokenInfo: {
        isUnlimited: token.isUnlimited,
        monthlyLimit: token.monthlyLimit,
        durationMonths: token.durationMonths,
        expiresAt: token.expiresAt,
        isPremium: token.isPremium,
        projectType: token.projectType,
      },
    };
  }
}

module.exports = new AnalyticsService();
