module.exports = (sequelize, { DataTypes, Op }) => {
  const ColorProduct = sequelize.define(
    'ColorProduct',
    {
      prd_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        allowNull: true,
      },
      color_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        allowNull: true,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'color_product',
    }
  );

  ColorProduct.associate = (models) => {
    ColorProduct.belongsTo(models.Color, {
      foreignKey: {
        name: 'color_id',
      },
      sourceKey: 'id',
      through: 'color_product',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    ColorProduct.belongsTo(models.Product, {
      foreignKey: {
        name: 'prd_id',
      },
      sourceKey: 'id',
      through: 'color_product',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };
  return ColorProduct;
};
