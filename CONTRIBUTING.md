


# راهنمای مشارکت

## نصب و راه‌اندازی
1. مخزن را کلون کنید
2. `yarn install` را اجرا کنید
3. فایل `.env.development` را بر اساس نمونه `.env.example` ایجاد کنید
4. `yarn dev` را برای اجرای سرور در حالت توسعه اجرا کنید

## تست
- برای اجرای تست‌ها: `yarn test`
- برای اجرای تست‌ها با پوشش: `yarn test:coverage`

## لینت کردن
- برای اجرای لینتر: `yarn lint`
- برای رفع خودکار مشکلات لینت: `yarn lint:fix`

## ساختار پروژه
```
auth-token-hub/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── environment.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── analytics/
│   │   │   ├── getAnalytics.js
│   │   │   └── index.js
│   │   ├── apiAuth/
│   │   │   └── apiTokenController.js
│   │   └── token/
│   │       ├── createToken.js
│   │       ├── getTokens.js
│   │       ├── index.js
│   │       ├── revokeToken.js
│   │       ├── updateToken.js
│   │       └── validateToken.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── AccessToken.js
│   │   ├── ApiToken.js
│   │   ├── index.js
│   │   └── UsageData.js
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── apiAuthRoutes.js
│   │   ├── index.js
│   │   └── tokenRoutes.js
│   ├── services/
│   │   ├── analyticsService.js
│   │   ├── apiTokenService.js
│   │   └── tokenService.js
│   └── utils/
│       ├── ipDetector.js
│       ├── ipTracker.js
│       ├── logger.js
│       └── usageAnalytics.js
├── .env.development
├── .env.example
├── .eslintrc.js
├── CONTRIBUTING.md
├── docker-compose.yml
├── Dockerfile
├── package.json
├── README.md
└── yarn.lock
```

## گردش کار گیت
1. یک شاخه جدید ایجاد کنید: `git checkout -b feature/your-feature-name`
2. تغییرات خود را اعمال کنید
3. تست‌ها را اجرا کنید تا از صحت تغییرات اطمینان حاصل کنید
4. تغییرات را کامیت کنید: `git commit -am 'Add some feature'`
5. شاخه خود را به مخزن اصلی push کنید: `git push origin feature/your-feature-name`
6. یک Pull Request ایجاد کنید

## نکات مهم برای مشارکت
- قبل از ایجاد Pull Request، مطمئن شوید که کد شما با استانداردهای لینت پروژه مطابقت دارد.
- برای هر ویژگی یا رفع باگ جدید، تست‌های مناسب بنویسید.
- مستندات (شامل README.md و کامنت‌های Swagger) را برای هر تغییر API به‌روز کنید.
- در صورت اضافه کردن وابستگی جدید، دلیل آن را در پیام کامیت یا توضیحات Pull Request ذکر کنید.
- برای تغییرات بزرگ، ابتدا یک Issue ایجاد کنید تا درباره آن بحث شود.

## راهنمای استایل کد
- از استایل کد Airbnb JavaScript پیروی کنید.
- از فرمت‌کننده Prettier برای فرمت‌بندی یکنواخت کد استفاده کنید.
- نام‌گذاری متغیرها و توابع باید معنادار و توصیفی باشد.
- کامنت‌گذاری مناسب برای بخش‌های پیچیده کد را فراموش نکنید.

## مدیریت وابستگی‌ها
- از Yarn برای مدیریت وابستگی‌ها استفاده کنید.
- قبل از اضافه کردن یک وابستگی جدید, ضرورت آن را بررسی کنید.
- وابستگی‌های توسعه را با `yarn add --dev` نصب کنید.

## دستورات مفید
- `yarn start`: اجرای برنامه در محیط تولید
- `yarn dev`: اجرای برنامه در حالت توسعه با nodemon
- `yarn lint`: اجرای لینتر
- `yarn test`: اجرای تست‌ها
- `yarn build`: ساخت نسخه تولید (در صورت نیاز)

با تشکر از مشارکت شما در بهبود این پروژه!
```

