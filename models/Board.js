module.exports = (sequelize, DataType) => {
  const Board = sequelize.define(
    'Board',
    {
      id: {
        type: DataType.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataType.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataType.TEXT,
      },
      status: {
        type: DataType.ENUM,
        values: ['0', '1', '2'],
        allowNull: false,
        default: '2',
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'board',
      paranoid: true,
    }
  );
  Board.associate = (models) => {
    Board.belongsTo(models.User);
  };

  return Board;
};
