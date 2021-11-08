const bcrypt = require('bcrypt');
const { getSeparateString } = require('../modules/util');
const numeral = require('numeral');
const createPager = require('../modules/pager-init');

module.exports = (sequelize, { DataTypes, Op }) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userid: {
        type: DataTypes.STRING(24),
        allowNull: false,
        unique: true,
        validate: {
          isAlphanumeric: true,
          len: [6, 24],
        },
      },
      userpw: {
        type: DataTypes.CHAR(60),
        allowNull: false,
        /* set(value) {
          const { BCRYPT_SALT: salt, BCRYPT_ROUND: rnd } = process.env;
          const hash = bcrypt.hashSync(value + salt, Number(rnd));
          this.setDataValue('userpw', hash);
        }, */
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      status: {
        type: DataTypes.ENUM,
        /* 
        0: 탈퇴
        1: 유휴
        2: 일반
        3: 우대
        7: 관리자
        8: 관리자
        9: 최고관리자
        */
        values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        allowNull: false,
        defaultValue: '2',
      },
      addrPost: {
        type: DataTypes.CHAR(5),
      },
      addrRoad: {
        type: DataTypes.STRING(255),
      },
      addrJibun: {
        type: DataTypes.STRING(255),
      },
      addrComment: {
        type: DataTypes.STRING(255),
      },
      addrDetail: {
        type: DataTypes.STRING(255),
      },
      tel: {
        type: DataTypes.STRING(14),
      },
      tel1: {
        type: DataTypes.VIRTUAL,
      },
      tel2: {
        type: DataTypes.VIRTUAL,
      },
      tel3: {
        type: DataTypes.VIRTUAL,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'user',
      paranoid: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Board, {
      foreignKey: {
        name: 'user_id',
        allowNull: false,
      },
      sourceKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.BoardCounter, {
      foreignKey: {
        name: 'user_id',
        allowNull: true,
      },
      sourceKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  User.beforeCreate(async (user) => {
    const { BCRYPT_SALT: salt, BCRYPT_ROUND: rnd } = process.env;
    const hash = await bcrypt.hash(user.userpw + salt, Number(rnd));
    user.userpw = hash;
    user.tel = getSeparateString([user.tel1, user.tel2, user.tel3], '-');
  });

  User.beforeUpdate(async (user) => {
    user.tel = getSeparateString([user.tel1, user.tel2, user.tel3], '-');
  });

  User.getCount = async function (query) {
    return await this.count({
      where: sequelize.getWhere(query),
    });
  };

  User.getLists = async function (query) {
    let { field = 'id', sort = 'desc', page = 1 } = query;
    //pager Query
    const totalRecord = await this.getCount(query);
    const pager = createPager(page, totalRecord, (_listCnt = 5), (_pagerCnt = 3));
    //find Query
    const rs = await this.findAll({
      order: [[field || 'id', sort || 'desc']],
      offset: pager.startIdx,
      limit: pager.listCnt,
      where: sequelize.getWhere(query),
    });
    const lists = rs
      .map((v) => v.toJSON())
      .map((v) => {
        v.addr1 =
          v.addrPost && v.addrRoad
            ? `[${v.addrPost}] 
        ${v.addrRoad || ''} 
        ${v.addrComment || ''}
        ${v.addrDetail || ''}`
            : '';
        v.addr2 =
          v.addrPost && v.addrJibun
            ? `[${v.addrPost}] 
        ${v.addrJibun}
        ${v.addrDetail || ''}`
            : '';
        v.level = '';
        switch (v.status) {
          case '0':
            v.level = '탈퇴회원';
            break;
          case '1':
            v.level = '유휴회원';
            break;
          case '2':
            v.level = '일반회원';
            break;
          case '8':
            v.level = '관리자';
            break;
          case '9':
            v.level = '최고관리자';
            break;
          default:
            v.level = '회원';
            break;
        }
        return v;
      });
    return { lists, pager, totalRecord: numeral(pager.totalRecord).format() };
  };

  return User;
};
