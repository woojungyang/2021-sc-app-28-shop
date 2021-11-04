'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const insertUsers = [];
    for (let i = 300; i < 1300; i++) {
      insertUsers.push({
        userid: 'test' + i,
        userpw: '111111',
        username: '테스트유저' + i,
        email: 'test' + i + '@test.com',
        tel: '010-0000-0000',
        addrPost: String(10000 + i),
        addrRoad: '서울시 마포구 노고산로',
        addrJibun: '서울시 마포구 창천동',
        addrComment: '(창천동)',
        addrDetail: 1 + i + '층',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('User', insertUsers);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('User', null, {});
  },
};
