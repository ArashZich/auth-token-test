


# راهنمای استفاده از API توکن
## نصب و راه‌اندازی

1. مخزن را کلون کنید
2. `yarn install` را اجرا کنید
3. فایل `.env.development` را بر اساس نمونه `.env.example` ایجاد کنید
4. `yarn dev` را برای اجرای سرور در حالت توسعه اجرا کنید

## نقاط پایانی API

### 1. ایجاد توکن برای کاربر
- **روش:** `POST`
- **آدرس:** `/api/v1/create`
- **بدنه درخواست:**

  ```json
  {
    "clientId": "client123",
    "monthlyLimit": 1000,
    "durationMonths": 3,
    "isUnlimited": false,
    "isPremium": false,
    "projectType": "web"
  }
  ```

  یا

  ```json
  {
    "clientId": "client123",
    "durationMonths": 3,
    "isUnlimited": true,
    "isPremium": true,
    "projectType": "mobile"
  }
  ```

  **نکته:** برای توکن‌های نامحدود، `"isUnlimited": true` را تنظیم کنید و `monthlyLimit` را حذف کنید.

### 2. اعتبارسنجی توکن کاربر
- **روش:** `POST`
- **آدرس:** `/api/v1/validate`
- **بدنه درخواست:**

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 3. دریافت همه توکن‌های کاربر
- **روش:** `GET`
- **آدرس:** `/api/v1/all`

### 4. دریافت اطلاعات توکن خاص کاربر
- **روش:** `GET`
- **آدرس:** `/api/v1/{clientId}`

### 5. به‌روزرسانی توکن کاربر
- **روش:** `PUT`
- **آدرس:** `/api/v1/{clientId}`
- **بدنه درخواست:**

  ```json
  {
    "additionalRequests": 500,
    "newMonthlyLimit": 1500,
    "additionalMonths": 2,
    "isUnlimited": false,
    "isPremium": true,
    "projectType": "desktop"
  }
  ```

  **نکته:** می‌توانید فقط فیلدهایی که می‌خواهید به‌روزرسانی کنید را ارسال کنید.

### 6. لغو توکن کاربر
- **روش:** `POST`
- **آدرس:** `/api/v1/{clientId}/revoke`

### 7. بررسی سلامت سرور
- **روش:** `GET`
- **آدرس:** `/api/v1/health`

### 8. دریافت داده‌های آنالیز
- **روش:** `GET`
- **آدرس:** `/api/v1/analytics/{clientId}`
- **پارامترهای Query:**
  - `period`: دوره زمانی (`week`, `month`, `sixMonths`, `all`) - پیش‌فرض: `all`
  - `page`: شماره صفحه برای صفحه‌بندی - پیش‌فرض: `1`
  - `pageSize`: تعداد آیتم‌ها در هر صفحه - پیش‌فرض: `20`

- **مثال درخواست:**

  ```
  GET /api/v1/analytics/client123?period=month&page=1&pageSize=50
  ```

- **پاسخ:**

  ```json
  {
    "uid": "faec6802-48c3-4617-8dad-c1bf62d5f223",
    "clientId": "client123",
    "period": "month",
    "totalRequestCount": 5000,
    "currentUsageCount": 1500,
    "data": [...],
    "pagination": {
      "currentPage": 1,
      "pageSize": 50,
      "totalPages": 10,
      "totalCount": 500
    },
    "tokenInfo": {
      "isUnlimited": false,
      "monthlyLimit": 1000,
      "durationMonths": 3,
      "expiresAt": "2023-12-31T23:59:59.999Z",
      "isPremium": true,
      "projectType": "web"
    }
  }
  ```

### 9. دریافت داده‌های آنالیز با UID
- **روش:** `GET`
- **آدرس:** `/api/v1/analytics/uid/{uid}`
- **پارامترهای Query:** مشابه با endpoint قبلی

### 10. ایجاد توکن API
- **روش:** `POST`
- **آدرس:** `/api/v1/api-auth/create-token`
- **بدنه درخواست:**

  ```json
  {
    "name": "John Doe",
    "phoneNumber": "1234567890",
    "description": "API token for admin"
  }
  ```

### 11. دریافت همه توکن‌های API
- **روش:** `GET`
- **آدرس:** `/api/v1/api-auth/tokens`

### 12. غیرفعال کردن توکن API
- **روش:** `POST`
- **آدرس:** `/api/v1/api-auth/deactivate/{id}`

## نکات مهم:
- در تمام آدرس‌ها، `localhost:3306` را با آدرس و پورت صحیح سرور خود جایگزین کنید.
- در درخواست‌هایی که نیاز به `clientId` دارند، `client123` را با شناسه مشتری مورد نظر خود جایگزین کنید.
- در درخواست اعتبارسنجی توکن، `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` را با توکن واقعی جایگزین کنید.
- توکن‌های نامحدود محدودیت درخواست ماهانه و کل ندارند.
- برای توکن‌های محدود، محدودیت کل به صورت `محدودیت ماهانه * تعداد ماه‌ها` محاسبه می‌شود.
- برای توکن‌های محدود، درخواست‌ها از یک IP یکسان در بازه 30 دقیقه‌ای به عنوان یک درخواست محسوب می‌شوند.
- در بخش آنالیز، می‌توانید داده‌های استفاده را برای دوره‌های زمانی مختلف و با صفحه‌بندی دریافت کنید.
- برای استفاده از API‌های محافظت شده، باید از توکن API در هدر `Authorization` استفاده کنید.

## توسعه
- برای اجرای تست‌ها: `yarn test`
- برای اجرای لینتر: `yarn lint`

## مستندات API
مستندات Swagger در آدرس `/api-docs` در دسترس است.
```
