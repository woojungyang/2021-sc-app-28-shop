const _ = require('lodash');
const numeral = require('numeral');
const { dateFormat, relPath } = require('../modules/util');
const createPager = require('../modules/pager-init');
const { unescape } = require('html-escaper');

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
  };

  Product.getCount = async function (query) {
    return await this.count({
      where: sequelize.getWhere(query),
    });
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
        if (v.ProductFiles.length) {
          for (let file of v.ProductFiles) {
            if (file.fileType === 'I') {
              v.img = relPath(file.saveName);
              break;
            }
          }
        }
        v.img = v.img || 'https://via.placeholder.com/120';
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
        [ProductFile, 'fileType', 'DESC'],
        [ProductFile, 'fieldNum', 'ASC'],
      ],
    });
    const lists = this.getListData(rs);

    return { lists, pager, totalRecord: numeral(pager.totalRecord).format() };
  };

  return Product;
};

/* 
* JSON.stringify() 메소드
JSON.stringify() 메소드는 인수로 전달받은 자바스크립트 객체를 문자열로 변환하여 반환합니다.

ex) JSON.stringify(value)
value에는 변환할 자바스크립트 객체를 전달합니다.

* JSON.parse() 메소드
JSON.parse() 메소드는 JSON.stringify() 메소드와는 반대로 인수로 전달받은 문자열을 자바스크립트 객체로 변환하여 반환합니다.

ex) JSON.parse(text)

text에는 변환할 문자열을 전달합니다.
이때 해당 문자열은 반드시 유효한 JSON 형식의 문자열이어야 합니다.

toJSON() 메소드
자바스크립트의 toJSON() 메소드는 자바스크립트의 Date 객체의 데이터를 JSON 형식의 문자열로 변환하여 반환합니다.

따라서 이 메소드는 Date.prototype 객체에서만 사용할 수 있습니다.


* toJSON() 메소드
접미사 Z로 식별되는 UTC 표준 시간대의 날짜를 ISO 8601 형식의 문자열로 반환합니다.
따라서 이 문자열은 언제나 24개나 27개의 문자로 이루어지며, 다음과 같은 형식을 따릅니다.

ex) YYYY-MM-DDTHH:mm:ss.sssZ / ±YYYYYY-MM-DDTHH:mm:ss.sssZ

*/
