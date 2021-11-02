module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('board', 'user_id', {
      type: Sequelize.INTEGER(10).UNSIGNED,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
  down: async (queryInterface, _Sequelize) => {
    // await queryInterface.dropTable('users');
  },
};
