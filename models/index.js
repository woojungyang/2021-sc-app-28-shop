const fs = require('fs-extra');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
config.timezone = '+09:00';
const db = {};

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
sequelize?
:  nodeJS에서 mysql을 사용할 때 raw Query문을 사용하지 않고 더욱 쉽게 다룰 수 있도록 도와주는 라이브러리ORM(Object-Relational Mapping)로 분류. ORM이란 객체와 관계형 데이터베이스의 관계를 매핑 해주는 도구이다.
sequelize를 사용하면 raw Query문을 사용하지 않고 자바스크립트를 이용해서 mysql을 사용할 수 있다.
  config: 데이터베이스 설정 파일, 사용자 이름, DB 이름, 비밀번호 등의 정보
  Sequelize CLI(터미널에서 명령어를 사용해 데이터베이스 작업을 할 수 있게 만들어주는 툴)를 통해서 모델을 생성할 수 있고 마이그레이션을 통해 실제 데이터베이스에 반영할 수 있다. 
  *.fs.readdirSync(__dirname)...
   ->우리가 작성한 table 파일을 찾아오는 부분.
  *.Object.keys(db).forEach((modelName) => {...
    ->DB에 모델 이름을 연결.
*/
