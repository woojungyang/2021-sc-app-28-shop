module.exports = (sequelize, DataTypes) => {
  const BoardComment = sequelize.define(
    'BoardComment',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      writer: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      comment: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'boardcomment',
      paranoid: true,
    }
  );

  BoardComment.associate = (models) => {
    BoardComment.belongsTo(models.Board, {
      foreignKey: {
        name: 'board_id',
        allowNull: false,
      },
      sourceKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return BoardComment;
};
