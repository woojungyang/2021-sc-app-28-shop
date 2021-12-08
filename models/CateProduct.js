const _ = require('lodash');
const { dateFormat, relPath } = require('../modules/util');

module.exports = (sequelize, { DataTypes, Op }) => {
  const CateProduct = sequelize.define(
    'CateProduct',
    {
      prd_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        allowNull: true,
      },
      cate_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        allowNull: true,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'cate_product',
    }
  );

  CateProduct.associate = (models) => {
    CateProduct.belongsTo(models.Cate, {
      foreignKey: {
        name: 'cate_id',
      },
      sourceKey: 'id',
      through: 'cate_product',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    CateProduct.belongsTo(models.Product, {
      foreignKey: {
        name: 'prd_id',
      },
      sourceKey: 'id',
      through: 'cate_product',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };
  return CateProduct;
};
