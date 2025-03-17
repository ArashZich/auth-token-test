const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const config = require("./environment");
const basicAuth = require("express-basic-auth");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Token API",
      version: "1.0.0",
      description: "API for managing access tokens and analytics",
    },
    servers: [
      {
        url: config.API_BASE_URL,
        description: `${config.NODE_ENV} server`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/controllers/token/*.js",
    "./src/controllers/analytics/*.js",
    "./src/controllers/apiAuth/*.js",
    "./src/models/*.js",
    "./src/routes/*.js",
  ],
};

const specs = swaggerJsdoc(options);

const swaggerAuth = basicAuth({
  users: { [config.SWAGGER_USERNAME]: config.SWAGGER_PASSWORD },
  challenge: true,
});

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    explorer: true,
    customCssUrl:
      "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
    },
  }),
  specs,
  swaggerAuth,
};
