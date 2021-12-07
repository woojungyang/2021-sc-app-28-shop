const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');

module.exports = (sequelize, { DataTypes, Op }) => {
  const Color = sequelize.define(
    'Color',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(7),
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'color',
      paranoid: false,
    }
  );

  Color.associate = (models) => {
    Color.belongsToMany(models.Product, {
      foreignKey: {
        name: 'color_id',
      },
      through: 'color_product',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return Color;
};
