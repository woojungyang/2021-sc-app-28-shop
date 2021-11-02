const bcrypt = require('bcrypt');
const { generateUser } = require('../modules/util');

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
        /*   set(value) {
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
        validate: {
          len: [11, 14],
        },
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
    User.hasMany(models.Board);
  };

  User.beforeCreate(async (user) => {
    const { BCRYPT_SALT: salt, BCRYPT_ROUND: rnd } = process.env;
    const hash = bcrypt.hashSync(user.userpw + salt, Number(rnd));
    user.userpw = hash;
  });
  User.searchUser = async function (query, pager) {
    let { field = 'id', search = '', sort = 'desc' } = query;
    let where = search ? { [field]: { [Op.like]: '%' + search + '%' } } : null;
    if (field === 'tel' && search !== '') {
      where = {
        [Op.or]: {
          tel1: { [Op.like]: '%' + search + '%' },
          tel2: { [Op.like]: '%' + search + '%' },
          tel3: { [Op.like]: '%' + search + '%' },
        },
      };
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
    const rs = await this.findAll({
      order: [[field || 'id', sort || 'desc']],
      offset: pager.startIdx,
      limit: pager.listCnt,
      where,
    });
    const users = generateUser(rs);
    return users;
  };

  return User;
};

/* 
필드명이 바뀌거나, 자릿수가 바뀌었을때는 migration의 대상이지만
validate는 대상이 아님. 
필드명이나 단위가 바뀔 경우에는 .js 파일도수정해주고 sql에 가서 직접적으로 바꿔야함, 안그러면 자료 다날라가요 */
