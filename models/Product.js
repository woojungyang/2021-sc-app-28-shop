const _ = require('lodash');
const numeral = require('numeral');
const { dateFormat, relPath } = require('../modules/util');
const createPager = require('../modules/pager-init');

module.exports = (sequelize, { DataTypes, Op }) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      priceOrigin: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        defaultValue: 0,
      },
      priceSale: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        defaultValue: 0,
      },
      amount: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        defaultValue: -1,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['0', '1', '2'],
        defaultValue: '2',
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      readCounter: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        defaulValue: 0,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'product',
      paranoid: true,
    }
  );

  Product.associate = (models) => {
    Product.hasMany(models.ProductFile, {
      foreignKey: {
        name: 'prd_id',
        allowNull: false,
      },
      sourceKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    Product.belongsToMany(models.Cate, {
      foreignKey: {
        name: 'prd_id',
        allowNull: false,
      },
      through: 'cate_product',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  Product.getCount = async function (query) {
    return await this.count({
      where: sequelize.getWhere(query),
    });
  };

  Product.getViewData = function (rs, type) {
    const data = rs
      .map((v) => v.toJSON())
      .map((v) => {
        v.priceOrigin = numeral(v.priceOrigin).format();
        v.priceSale = numeral(v.priceSale).format();
        if (type === 'view') {
          v.updatedAt = dateFormat(v.updatedAt, 'H');
          v.readCounter = numeral(v.readCounter).format();
          v.img = [];
          v.detail = [];
          if (v.ProductFiles.length) {
            for (let file of v.ProductFiles) {
              let obj = {
                thumbSrc: relPath(file.saveName),
                name: file.oriName,
                id: file.id,
                type: file.fileType,
              };
              if (obj.type === 'F') v.detail.push(obj);
              else v.img.push(obj);
            }
          }
        } else {
          if (v.ProductFiles.length) {
            for (let file of v.ProductFiles) {
              if (file.fileType === 'I') {
                v.img = {
                  thumbSrc: relPath(file.saveName),
                  name: file.oriName,
                  id: file.id,
                  type: file.fileType,
                };
                break;
              }
            }
          }
        }
        delete v.createdAt;
        delete v.deletedAt;
        delete v.ProductFiles;
        return v;
      });
    return data;
  };

  Product.getLists = async function (query, ProductFile) {
    let { field, sort, page, search } = query;
    let listCnt = 10;
    let pagerCnt = 5;
    const totalRecord = await this.getCount(query);
    const pager = createPager(page, totalRecord, listCnt, pagerCnt);

    const rs = await this.findAll({
      order: [[field, sort]],
      offset: pager.startIdx,
      limit: pager.listCnt,
      where: sequelize.getWhere(query),
      include: [{ model: ProductFile, attributes: ['saveName', 'fileType'] }],
    });
    const lists = this.getViewData(rs);

    return { lists, pager, totalRecord: numeral(pager.totalRecord).format() };
  };

  return Product;
};
