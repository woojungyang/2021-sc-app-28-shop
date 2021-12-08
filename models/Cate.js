const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const { findObj, findChildId } = require('../modules/util');

module.exports = (sequelize, { DataTypes, Op }) => {
  const Cate = sequelize.define(
    'Cate',
    {
      id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      parents: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },

    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'cate',
      paranoid: false,
    }
  );

  Cate.associate = (models) => {
    Cate.belongsToMany(models.Product, {
      foreignKey: {
        name: 'cate_id',
      },
      through: 'cate_product',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  Cate.getAllCate = async function () {
    try {
      const tree = await fs.readJSON(path.join(__dirname, '../json/tree.json'));
      return tree;
    } catch (err) {
      console.log(err);
    }
  };

  Cate.getChildren = async function (query) {
    try {
      let { cid: cateId } = query;
      const allTree = await this.getAllCate();
      const myTree = findObj(allTree[0], cateId);
      const childTree = findChildId(myTree, []);
      return { allTree, myTree, childTree };
    } catch (err) {
      console.log(err);
    }
  };

  return Cate;
};
