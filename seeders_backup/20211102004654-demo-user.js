const numeral = require('numeral');
const bcrypt = require('bcrypt');
const { BCRYPT_SALT: salt, BCRYPT_ROUND: round } = process.env;
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const insertUsers = [];
    insertUsers.push({
      userid: 'booldook',
      userpw: await bcrypt.hash('112233' + salt, Number(round)),
      username: '최고관리자',
      email: 'booldook@gmail.com',
      tel: '010-3333-8888',
      addrPost: '12345',
      addrRoad: '서울시 마포구 노고산로',
      addrJibun: '서울시 마포구 창천동',
      addrComment: '(창천동)',
      addrDetail: '7층',
      status: '9',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    insertUsers.push({
      userid: 'demoUser',
      userpw: await bcrypt.hash('111111' + salt, Number(round)),
      username: '데모관리자',
      email: 'demo@demo.com',
      tel: '010-3333-8888',
      addrPost: '12345',
      addrRoad: '서울시 마포구 노고산로',
      addrJibun: '서울시 마포구 창천동',
      addrComment: '(창천동)',
      addrDetail: '7층',
      status: '7',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    for (let i = 0; i < 45; i++) {
      insertUsers.push({
        userid: 'test' + i,
        userpw: await bcrypt.hash('222222' + salt, Number(round)),
        username: '테스트유저' + i,
        email: 'test' + i + '@test.com',
        tel: `010-7777-${numeral(i).format('0000')}`,
        addrPost: String(10000 + i),
        addrRoad: '서울시 마포구 노고산로',
        addrJibun: '서울시 마포구 창천동',
        addrComment: '(창천동)',
        addrDetail: 1 + i + '층',
        status: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('user', insertUsers);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user', null, {});
  },
};
