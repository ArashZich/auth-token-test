const { ValidationError } = require("sequelize");

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: {
        message: "Validation error",
        details: err.errors.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      },
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      error: {
        message: "Duplicate entry",
        details: err.errors.map((e) => ({
          field: e.path,
          message: "This value must be unique",
        })),
      },
    });
  }

  res.status(500).json({
    error: {
      message: "An unexpected error occurred",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    },
  });
}

module.exports = errorHandler;
