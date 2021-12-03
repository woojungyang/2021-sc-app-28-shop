const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const { findLastId, findObj, findAllId, findChildId } = require('../modules/util');
const { dateFormat, relPath } = require('../modules/util');
const Product = require('./Product');

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
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'cate',
      paranoid: true,
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

  Cate.getProduct = async function (query, Product, ProductFile) {
    try {
      const { cid = 'j1_1', field, search, sort } = query;
      const [allTree] = await this.getAllCate();
      const myTree = findObj(allTree, cid);
      const lastTree = findLastId(myTree, []);
      /* const rs = await this.findAll({
        where: { id: { [Op.or]: [...lastTree] } },
        attributes: ['id'],
        include: [
          {
            model: Product,
            through: { attributes: [] },
            attributes: [
              'id',
              'title',
              'priceOrigin',
              'priceSale',
              'amount',
              'status',
              'summary',
              'readCounter',
            ],
            where: sequelize.getWhere(query, '2'),
            order: [[field, sort]],
            include: [
              {
                model: ProductFile,
                attributes: ['id', 'saveName', 'fileType', 'fieldNum'],
                order: [
                  [ProductFile, 'fileType', 'ASC'],
                  [ProductFile, 'fieldNum', 'ASC'],
                ],
              },
            ],
          },
        ],
      }); */
      const rs = await Product.findAll({
        where: sequelize.getWhere(query, '2'),
        attributes: [
          'id',
          'title',
          'priceOrigin',
          'priceSale',
          'amount',
          'status',
          'summary',
          'readCounter',
        ],
        include: [
          {
            model: Cate,
            through: { attributes: [] },
            attributes: [['id', 'cid']],
            where: { id: { [Op.or]: [...lastTree] } },
            order: [[field, sort]],
          },
          {
            model: ProductFile,
            attributes: ['id', 'saveName', 'fileType', 'fieldNum'],
            order: [
              [ProductFile, 'fileType', 'ASC'],
              [ProductFile, 'fieldNum', 'ASC'],
            ],
          },
        ],
      });
      return rs;
    } catch (err) {
      console.log(err);
    }
  };

  return Cate;
};
