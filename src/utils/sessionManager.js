// src/utils/SessionManager.js

class SessionManager {
  constructor(timeoutSeconds = 10) {
    this.sessions = new Map();
    this.timeoutSeconds = timeoutSeconds * 1000; // تبدیل به میلی‌ثانیه

    // پاکسازی خودکار جلسات منقضی شده هر ۵ دقیقه
    setInterval(() => {
      this.cleanExpiredSessions();
    }, 5 * 60 * 1000);
  }

  /**
   * بررسی می‌کند که آیا درخواست باید به عنوان درخواست جدید محسوب شود یا خیر
   * @param {string} tokenId - شناسه توکن
   * @param {string} ipAddress - آدرس IP درخواست دهنده
   * @returns {boolean} - آیا باید به عنوان یک درخواست جدید شمارش شود
   */
  shouldCountAsNewRequest(tokenId, ipAddress) {
    const now = Date.now();
    const sessionKey = `${tokenId}:${ipAddress}`;

    // اگر جلسه وجود ندارد یا منقضی شده
    if (!this.sessions.has(sessionKey)) {
      this.sessions.set(sessionKey, now);
      return true;
    }

    const lastRequestTime = this.sessions.get(sessionKey);
    const timeDifference = now - lastRequestTime;

    // اگر بیشتر از زمان تعیین شده گذشته باشد
    if (timeDifference >= this.timeoutSeconds) {
      this.sessions.set(sessionKey, now);
      return true;
    }

    // بروزرسانی زمان آخرین درخواست
    this.sessions.set(sessionKey, now);
    return false;
  }

  /**
   * حذف جلسات منقضی شده برای جلوگیری از نشت حافظه
   */
  cleanExpiredSessions() {
    const now = Date.now();

    for (const [sessionKey, lastRequestTime] of this.sessions.entries()) {
      const timeDifference = now - lastRequestTime;

      // حذف جلسات‌هایی که بیشتر از یک ساعت بلااستفاده بوده‌اند
      if (timeDifference > 60 * 60 * 1000) {
        this.sessions.delete(sessionKey);
      }
    }
  }

  /**
   * پاک کردن کل جلسات یک توکن مشخص
   * @param {string} tokenId - شناسه توکن
   */
  clearSessionsByTokenId(tokenId) {
    for (const sessionKey of this.sessions.keys()) {
      if (sessionKey.startsWith(`${tokenId}:`)) {
        this.sessions.delete(sessionKey);
      }
    }
  }
}

// ایجاد یک نمونه سینگلتون برای استفاده در کل برنامه
const sessionManager = new SessionManager();

module.exports = sessionManager;
