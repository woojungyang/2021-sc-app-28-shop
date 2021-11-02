module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'addrPost', {
      type: Sequelize.CHAR(5),
    });
    await queryInterface.addColumn('user', 'addrRoad', {
      type: Sequelize.STRING(255),
    });
    await queryInterface.addColumn('user', 'addrJibum', {
      type: Sequelize.STRING(255),
    });
    await queryInterface.addColumn('user', 'addrComment', {
      type: Sequelize.STRING(255),
    });
    await queryInterface.addColumn('user', 'addrDetail', {
      type: Sequelize.STRING(255),
    });
  },
  down: async (queryInterface, Sequelize) => {
    // await queryInterface.dropTable('user');
  },
};
