module.exports = (sequelize, DataTypes) => {
  const BoardFile = sequelize.define(
    'BoardFile',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      oriName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      saveName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      mimeType: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      fileType: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['I', 'F'],
        defaultValue: 'F',
      },
      size: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'boardfile',
      paranoid: true,
    }
  );

  BoardFile.associate = (models) => {
    BoardFile.belongsTo(models.Board, {
      foreignKey: {
        name: 'board_id',
        allowNull: false,
      },
      sourceKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return BoardFile;
};
