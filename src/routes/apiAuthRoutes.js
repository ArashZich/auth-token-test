// src/routes/apiAuthRoutes.js
const express = require("express");
const {
  createApiToken,
  getApiTokens,
  deactivateApiToken,
} = require("../controllers/apiAuth/apiTokenController");

const apiAuthRouter = express.Router();

apiAuthRouter.post("/create-token", createApiToken);
apiAuthRouter.get("/tokens", getApiTokens);
apiAuthRouter.post("/deactivate/:id", deactivateApiToken);

module.exports = apiAuthRouter;
