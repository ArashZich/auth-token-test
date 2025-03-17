# استفاده از نسخه Node.js 20
FROM node:20

# تنظیم دایرکتوری کاری در داخل کانتینر
WORKDIR /usr/src/app

# کپی کردن فایل‌های package.json و yarn.lock
COPY package.json yarn.lock ./

# نصب تمامی وابستگی‌ها با استفاده از yarn
RUN yarn install --production

# کپی کردن بقیه کدهای برنامه
COPY . .

# حذف دایرکتوری logs در محیط تولید
RUN if [ "$NODE_ENV" = "production" ] ; then rm -rf logs ; fi

# مشخص کردن پورت‌هایی که قرار است در کانتینر باز شوند
EXPOSE 3306

# اجرای برنامه
CMD ["yarn", "start"]