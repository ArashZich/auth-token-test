module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("access_tokens", "features", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn("access_tokens", "media_features", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("access_tokens", "features");
    await queryInterface.removeColumn("access_tokens", "media_features");
  },
};
