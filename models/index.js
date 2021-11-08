const path = require('path');
const fs = require('fs-extra');
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
config.timezone = '+09:00';
const db = {};

Sequelize.prototype.getWhere = function ({ field, search }) {
  // AND 'User'.'userid' LIKE %'test% 부분을 만듦(test를 검색했을시에)
  let where = search ? { [field]: { [Op.like]: '%' + search + '%' } } : {};
  if (field === 'tel' && search !== '') {
    where = this.where(this.fn('replace', this.col('tel'), '-', ''), {
      [Op.like]: '%' + search.replace(/-/g, '') + '%',
    });
  }
  if (field === 'addrRoad' && search !== '') {
    where = {
      [Op.or]: {
        addrPost: { [Op.like]: '%' + search + '%' },
        addrRoad: { [Op.like]: '%' + search + '%' },
        addrJibun: { [Op.like]: '%' + search + '%' },
        addrComment: { [Op.like]: '%' + search + '%' },
        addrDetail: { [Op.like]: '%' + search + '%' },
      },
    };
  }
  return where;
};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

/* 

  * Sequelize.prototype.getWhere = function ({ field, search }) {
  * [Op.and]: [{ ...sequelize.getWhere(query) }, { binit_id: query.boardId }],( models>Board.js)
    : AND 'User'.'userid' LIKE %'test% 부분을 만듦(test를 검색했을시에)
[Op.and] : [{}.{}] and로 엮을때 사용

    :    이것은 getWhere대로 돌고 있고,  이상태에서 Board.js와 엮어줘야함.[Op.and]

*/
