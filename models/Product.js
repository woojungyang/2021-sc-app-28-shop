const _ = require('lodash');
const numeral = require('numeral');
const { unescape } = require('html-escaper');
const { dateFormat, relPath, relThumbPath } = require('../modules/util');
const createPager = require('../modules/pager-init');
const { findLastId, findObj, findAllId, findChildId } = require('../modules/util');

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
      start: {
        type: DataTypes.DECIMAL(1, 1),
        allowNull: true,
      },
      readCounter: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        defaultValue: 0,
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
        allowNull: true,
      },
      sourceKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    Product.belongsToMany(models.Cate, {
      foreignKey: {
        name: 'prd_id',
      },
      through: 'cate_product',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    Product.belongsToMany(models.Color, {
      foreignKey: {
        name: 'prd_id',
      },
      through: 'color_product',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    Product.belongsToMany(models.Section, {
      foreignKey: {
        name: 'prd_id',
      },
      through: 'section_product',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  Product.getCount = async function (query) {
    return await this.count({
      where: sequelize.getWhere(query),
    });
  };

  Product.findProducts = async function (query, Cate, ProductFile) {
    try {
      let { field, sort, page = 1, search, grp, cid = 'j1_1' } = query;
      // tree
      const [allTree] = await Cate.getAllCate();
      const myTree = findObj(allTree, cid);
      const lastTree = findLastId(myTree, []);
      // pager
      let listCnt = 15;
      let pagerCnt = 5;
      const totalRecord = await this.getCount(query);
      const pager = createPager(page, totalRecord, listCnt, pagerCnt);

      const rs = await Product.findAll({
        where: sequelize.getWhere(query, '2'),
        offset: pager.startIdx,
        limit: pager.listCnt,
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

  Product.findProduct = async function (id, Cate, ProductFile) {
    const rs = await this.findOne({
      where: { id },
      order: [[ProductFile, 'id', 'asc']],
      include: [{ model: Cate }, { model: ProductFile }],
    });
    const data = rs.toJSON();
    data.updatedAt = dateFormat(data.updatedAt, 'H');
    data.readCounter = numeral(data.readCounter).format();
    data.content = unescape(data.content);
    data.imgs = [];
    data.details = [];
    if (data.ProductFiles.length) {
      for (let file of data.ProductFiles) {
        let obj = {
          thumbSrc: relPath(file.saveName),
          name: file.oriName,
          id: file.id,
          type: file.fileType,
          fieldNum: file.fieldNum,
        };
        if (obj.type === 'F') data.details.push(obj);
        else data.imgs.push(obj);
      }
    }
    delete data.createdAt;
    delete data.deletedAt;
    delete data.ProductFiles;
    return data;
  };

  Product.getListData = function (rs, type) {
    const data = rs
      .map((v) => v.toJSON())
      .map((v) => {
        v.priceOrigin = numeral(v.priceOrigin).format();
        v.priceSale = numeral(v.priceSale).format();
        let idx = _.findIndex(
          v.ProductFiles,
          (v2) => v2.fieldNum == '1' && v2.fileType == 'I'
        );
        v.img =
          idx > -1
            ? relThumbPath(v.ProductFiles[idx].saveName)
            : 'https://via.placeholder.com/120';
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
      offset: pager.startIdx,
      limit: pager.listCnt,
      where: sequelize.getWhere(query),
      include: [
        {
          model: ProductFile,
          attributes: ['id', 'saveName', 'fileType', 'fieldNum'],
        },
      ],
      order: [
        [field, sort],
        [ProductFile, 'fileType', 'ASC'],
        [ProductFile, 'fieldNum', 'ASC'],
      ],
    });
    const lists = this.getListData(rs);
    return { lists, pager, totalRecord: numeral(pager.totalRecord).format() };
  };

  return Product;
};
