// src/services/apiTokenService.js
const jwt = require("jsonwebtoken");
const { ApiToken } = require("../models");
const config = require("../config/environment");

class ApiTokenService {
  async createApiToken(name, phoneNumber, description) {
    try {
      const tokenData = {
        name,
        phoneNumber,
        type: "api_access",
        createdAt: new Date().toISOString(),
      };

      const token = jwt.sign(tokenData, config.API_SECRET, { expiresIn: "1y" });

      const apiToken = await ApiToken.create({
        token,
        name,
        phoneNumber,
        description,
      });

      return apiToken;
    } catch (error) {
      console.error("Error creating API token:", error);
      throw error;
    }
  }

  async getApiTokens() {
    try {
      return await ApiToken.findAll({
        attributes: [
          "id",
          "token",
          "name",
          "phoneNumber",
          "description",
          "isActive",
          "createdAt",
          "updatedAt",
        ],
      });
    } catch (error) {
      console.error("Error getting API tokens:", error);
      throw error;
    }
  }

  async deactivateApiToken(id) {
    try {
      const apiToken = await ApiToken.findByPk(id);
      if (!apiToken) {
        throw new Error("API token not found");
      }
      apiToken.isActive = false;
      await apiToken.save();
      return apiToken;
    } catch (error) {
      console.error("Error deactivating API token:", error);
      throw error;
    }
  }
}

module.exports = new ApiTokenService();
