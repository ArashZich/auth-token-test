// src/services/tokenService.js
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const config = require("../config/environment");
const { AccessToken, UsageData } = require("../models");
const { collectUsageData } = require("../utils/usageAnalytics");
const sessionManager = require("../utils/sessionManager");

const THIRTY_MINUTES = 30 * 60 * 1000;

class TokenService {
  async createToken(
    clientId,
    monthlyLimit,
    durationMonths,
    ipAddress,
    isUnlimited = false,
    isPremium = false,
    projectType = "other",
    features = null,
    mediaFeatures = null
  ) {
    try {
      if (!durationMonths || durationMonths <= 0) {
        throw new Error("durationMonths must be a positive number");
      }

      const expiresAt = this.calculateExpirationDate(
        new Date(),
        durationMonths
      );

      const uniqueId = uuidv4();
      const extraRandomness = crypto.randomBytes(32).toString("hex");

      const tokenData = {
        clientId,
        isUnlimited,
        monthlyLimit: isUnlimited ? null : monthlyLimit,
        durationMonths,
        totalLimit: isUnlimited ? null : monthlyLimit * durationMonths,
        uniqueId,
        extraRandomness,
        expiresAt: expiresAt.toISOString(),
        isPremium,
        projectType,
        // اضافه کردن فیلدهای جدید اگر وجود داشتند
        ...(features && { features }),
        ...(mediaFeatures && { mediaFeatures }),
      };

      const token = jwt.sign(tokenData, config.JWT_SECRET);

      const createdToken = await AccessToken.create({
        clientId,
        token,
        isUnlimited,
        durationMonths,
        monthlyLimit: isUnlimited ? null : monthlyLimit,
        totalLimit: isUnlimited ? null : monthlyLimit * durationMonths,
        expiresAt,
        lastUsedIp: ipAddress,
        lastUsedAt: new Date(),
        isPremium,
        projectType,
        features,
        mediaFeatures,
      });

      console.log("Token created:", createdToken.toJSON());
      return token;
    } catch (error) {
      console.error("Error creating token:", error);
      throw error;
    }
  }

  async validateToken(token, req, res) {
    const startTime = new Date();
    try {
      // بررسی و اعتبارسنجی اولیه توکن
      const decodedToken = jwt.verify(token, config.JWT_SECRET);
      if (!decodedToken || !decodedToken.clientId) {
        return {
          isValid: false,
          isPremium: false,
          projectType: null,
        };
      }

      // پیدا کردن توکن در دیتابیس
      const tokenInfo = await AccessToken.findOne({
        where: { clientId: decodedToken.clientId },
      });

      if (!tokenInfo) {
        return {
          isValid: false,
          isPremium: false,
          projectType: null,
        };
      }

      // بررسی تطابق توکن
      if (token !== tokenInfo.token) {
        return {
          isValid: false,
          isPremium: false,
          projectType: null,
        };
      }

      // بررسی تاریخ انقضا
      const now = new Date();
      if (now > tokenInfo.expiresAt) {
        return {
          isValid: false,
          isPremium: tokenInfo.isPremium,
          projectType: tokenInfo.projectType,
          userId: tokenInfo.clientId,
        };
      }

      // جمع‌آوری داده‌های استفاده
      const usageData = collectUsageData(req, res, startTime);
      console.log("Collected usage data:", usageData);

      // به‌روزرسانی داده‌های استفاده از توکن
      await this.updateTokenUsage(tokenInfo, req.clientIp, usageData);

      // اگر توکن نامحدود است
      if (tokenInfo.isUnlimited) {
        return {
          isValid: true,
          isPremium: tokenInfo.isPremium,
          projectType: tokenInfo.projectType,
          userId: tokenInfo.clientId,
          ...(tokenInfo.features && { features: tokenInfo.features }),
          ...(tokenInfo.mediaFeatures && {
            mediaFeatures: tokenInfo.mediaFeatures,
          }),
        };
      }

      // بررسی ریست ماهانه
      if (this.shouldResetMonthly(tokenInfo.lastUsedAt)) {
        tokenInfo.usageCount = 0;
        await tokenInfo.save(); // ذخیره‌سازی تغییرات
      }

      // بررسی افزایش تعداد استفاده با استفاده از session manager
      const shouldIncrementUsage = this.shouldIncrementUsage(
        tokenInfo,
        req.clientIp
      );

      if (shouldIncrementUsage) {
        tokenInfo.usageCount++;
        await tokenInfo.save(); // ذخیره‌سازی تغییرات

        // بررسی محدودیت کل
        if (
          tokenInfo.totalLimit !== null &&
          tokenInfo.totalLimit > 0 &&
          tokenInfo.usageCount > tokenInfo.totalLimit
        ) {
          return {
            isValid: false,
            isPremium: tokenInfo.isPremium,
            projectType: tokenInfo.projectType,
            userId: tokenInfo.clientId,
            limitExceeded: true,
            message: "Total request limit exceeded",
          };
        }

        // بررسی محدودیت ماهانه
        if (
          tokenInfo.monthlyLimit !== null &&
          tokenInfo.monthlyLimit > 0 &&
          tokenInfo.usageCount > tokenInfo.monthlyLimit
        ) {
          return {
            isValid: false,
            isPremium: tokenInfo.isPremium,
            projectType: tokenInfo.projectType,
            userId: tokenInfo.clientId,
            limitExceeded: true,
            message: "Monthly request limit exceeded",
          };
        }
      }

      // ساخت پاسخ نهایی
      const response = {
        isValid: true,
        isPremium: tokenInfo.isPremium,
        projectType: tokenInfo.projectType,
        userId: tokenInfo.clientId,
      };

      // اضافه کردن features اگر وجود داشته باشد
      if (tokenInfo.features) {
        // اگر features خالی نباشد و حداقل یک ویژگی داشته باشد
        if (
          Object.keys(tokenInfo.features).length > 0 &&
          (!Array.isArray(tokenInfo.features.allowedFeatures) ||
            tokenInfo.features.allowedFeatures.length > 0)
        ) {
          response.features = tokenInfo.features;
        }
      }

      // اضافه کردن mediaFeatures اگر وجود داشته باشد
      if (tokenInfo.mediaFeatures) {
        // اگر mediaFeatures خالی نباشد و حداقل یک ویژگی داشته باشد
        if (
          Object.keys(tokenInfo.mediaFeatures).length > 0 &&
          (tokenInfo.mediaFeatures.allowedSources?.length > 0 ||
            tokenInfo.mediaFeatures.allowedViews?.length > 0 ||
            tokenInfo.mediaFeatures.comparisonModes?.length > 0)
        ) {
          response.mediaFeatures = tokenInfo.mediaFeatures;
        }
      }

      // اضافه کردن اطلاعات استفاده فعلی
      response.usage = {
        current: tokenInfo.usageCount,
        limit: tokenInfo.monthlyLimit,
        remaining: tokenInfo.monthlyLimit
          ? tokenInfo.monthlyLimit - tokenInfo.usageCount
          : null,
        totalLimit: tokenInfo.totalLimit,
        totalRemaining: tokenInfo.totalLimit
          ? tokenInfo.totalLimit - tokenInfo.usageCount
          : null,
      };

      // اضافه کردن اطلاعات انقضا
      response.expiration = {
        expiresAt: tokenInfo.expiresAt,
        daysRemaining: Math.ceil(
          (tokenInfo.expiresAt - now) / (1000 * 60 * 60 * 24)
        ),
      };

      return response;
    } catch (error) {
      console.error("Error validating token:", error);
      // در صورت بروز خطا، پاسخ امن برگردانده می‌شود
      return {
        isValid: false,
        isPremium: false,
        projectType: null,
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Token validation failed",
      };
    }
  }

  async updateTokenUsage(tokenInfo, ipAddress, usageData) {
    try {
      tokenInfo.lastUsedIp = ipAddress;
      tokenInfo.lastUsedAt = new Date();
      tokenInfo.totalRequestCount++;

      await UsageData.create({
        accessTokenUid: tokenInfo.uid,
        ...usageData,
        totalRequestCount: tokenInfo.totalRequestCount,
      });

      await tokenInfo.save();

      const updatedToken = await AccessToken.findByPk(tokenInfo.uid);
      console.log("After save:", JSON.stringify(updatedToken.toJSON()));
    } catch (error) {
      console.error("Error updating token usage:", error);
      throw new Error("Error updating token usage");
    }
  }

  // جایگزین کردن متد shouldIncrementUsage با این کد:
  shouldIncrementUsage(tokenInfo, ipAddress) {
    // استفاده از session manager برای تصمیم‌گیری درمورد افزایش شمارنده
    return sessionManager.shouldCountAsNewRequest(tokenInfo.uid, ipAddress);
  }

  calculateExpirationDate(startDate, monthsToAdd) {
    const expirationDate = new Date(startDate);
    expirationDate.setMonth(expirationDate.getMonth() + monthsToAdd);
    return expirationDate;
  }

  shouldResetMonthly(lastUsedDate) {
    const now = new Date();
    const lastUsed = new Date(lastUsedDate);
    return (
      now.getMonth() !== lastUsed.getMonth() ||
      now.getFullYear() !== lastUsed.getFullYear()
    );
  }

  async getAllTokens() {
    try {
      return await AccessToken.findAll();
    } catch (error) {
      console.error("Error getting all tokens:", error);
      throw new Error("Error getting all tokens");
    }
  }

  async getTokenInfo(clientId) {
    try {
      return await AccessToken.findOne({ where: { clientId } });
    } catch (error) {
      console.error("Error getting token info:", error);
      throw new Error("Error getting token info");
    }
  }

  async updateToken(clientId, updateData) {
    try {
      const token = await AccessToken.findOne({ where: { clientId } });
      if (!token) {
        throw new Error("Token not found");
      }

      if (updateData.isUnlimited !== undefined) {
        token.isUnlimited = updateData.isUnlimited;
        if (token.isUnlimited) {
          token.monthlyLimit = null;
          token.totalLimit = null;
        } else {
          token.monthlyLimit =
            updateData.newMonthlyLimit || token.monthlyLimit || 0;
          token.totalLimit = token.monthlyLimit * token.durationMonths;
        }
      }

      if (updateData.projectType) {
        token.projectType = updateData.projectType;
      }

      if (!token.isUnlimited) {
        if (updateData.additionalRequests) {
          token.monthlyLimit += updateData.additionalRequests;
          token.totalLimit +=
            updateData.additionalRequests * token.durationMonths;
        }

        if (updateData.newMonthlyLimit !== undefined) {
          token.monthlyLimit = updateData.newMonthlyLimit;
          token.totalLimit = token.durationMonths * updateData.newMonthlyLimit;
        }
      }

      if (updateData.additionalMonths) {
        if (
          typeof updateData.additionalMonths === "string" &&
          updateData.additionalMonths.includes("-")
        ) {
          token.expiresAt = new Date(updateData.additionalMonths);
          const diffInMonths = Math.ceil(
            (token.expiresAt - new Date()) / (1000 * 60 * 60 * 24 * 30)
          );
          token.durationMonths = diffInMonths;
        } else {
          token.durationMonths += parseInt(updateData.additionalMonths);
          const now = new Date();
          token.expiresAt = this.calculateExpirationDate(
            now,
            token.durationMonths
          );
        }

        if (!token.isUnlimited) {
          token.totalLimit = token.monthlyLimit * token.durationMonths;
        }
      }

      if (updateData.isPremium !== undefined) {
        token.isPremium = updateData.isPremium;
      }

      // بررسی features
      if (updateData.features !== undefined) {
        token.features = updateData.features;
      }

      // بررسی mediaFeatures
      if (updateData.mediaFeatures !== undefined) {
        token.mediaFeatures = updateData.mediaFeatures;
      }

      const tokenData = {
        clientId: token.clientId,
        isUnlimited: token.isUnlimited,
        monthlyLimit: token.monthlyLimit,
        durationMonths: token.durationMonths,
        totalLimit: token.totalLimit,
        uniqueId: uuidv4(),
        extraRandomness: crypto.randomBytes(32).toString("hex"),
        expiresAt: token.expiresAt.toISOString(),
        isPremium: token.isPremium,
        projectType: token.projectType,
      };

      // اضافه کردن features و mediaFeatures به tokenData اگر موجود باشند
      if (token.features) {
        tokenData.features = token.features;
      }
      if (token.mediaFeatures) {
        tokenData.mediaFeatures = token.mediaFeatures;
      }

      const newJwtToken = jwt.sign(tokenData, config.JWT_SECRET);
      token.token = newJwtToken;

      await token.save();

      return { token: newJwtToken, ...token.toJSON() };
    } catch (error) {
      console.error("Error updating token:", error);
      throw error;
    }
  }

  // اضافه کردن این متد جدید به TokenService برای پاکسازی جلسات یک توکن
  // این متد میتواند در زمان revoke کردن توکن استفاده شود
  async clearTokenSessions(clientId) {
    try {
      const token = await AccessToken.findOne({ where: { clientId } });
      if (token) {
        sessionManager.clearSessionsByTokenId(token.uid);
      }
    } catch (error) {
      console.error("Error clearing token sessions:", error);
    }
  }

  // آپدیت تابع revokeToken برای پاکسازی جلسات توکن هنگام لغو
  async revokeToken(clientId) {
    try {
      const token = await AccessToken.findOne({ where: { clientId } });
      if (!token) {
        throw new Error("Token not found");
      }

      // پاکسازی جلسات توکن قبل از حذف
      await this.clearTokenSessions(clientId);

      await token.destroy();
      return { message: "Token successfully revoked" };
    } catch (error) {
      console.error("Error revoking token:", error);
      throw error;
    }
  }
}

module.exports = new TokenService();
