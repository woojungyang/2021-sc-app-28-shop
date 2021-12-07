const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');

module.exports = (sequelize, { DataTypes, Op }) => {
  const Section = sequelize.define(
    'Section',
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
      color: {
        type: DataTypes.STRING(7),
        allowNull: false,
        defaultValue: '#000000',
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'section',
      paranoid: false,
    }
  );

  Section.associate = (models) => {
    Section.belongsToMany(models.Product, {
      foreignKey: {
        name: 'section_id',
      },
      through: 'section_product',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return Section;
};
