module.exports = (sequelize, DataTypes) => {
  const BoardCounter = sequelize.define(
    'BoardCounter',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ip: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      referrer: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'boardcounter',
    }
  );

  BoardCounter.associate = (models) => {
    BoardCounter.belongsTo(models.Board, {
      foreignKey: {
        name: 'board_id',
        allowNull: false,
      },
      sourceKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    BoardCounter.belongsTo(models.User, {
      foreignKey: {
        name: 'user_id',
        allowNull: true,
      },
      sourceKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return BoardCounter;
};
