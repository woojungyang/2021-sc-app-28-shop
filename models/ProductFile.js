module.exports = (sequelize, DataTypes) => {
  const ProductFile = sequelize.define(
    'ProductFile',
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
        defaultValue: 'I',
      },
      fieldNum: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'productfile',
      paranoid: true,
    }
  );

  ProductFile.associate = (models) => {
    ProductFile.belongsTo(models.Product, {
      foreignKey: {
        name: 'prd_id',
        allowNull: true,
      },
      sourceKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return ProductFile;
};
