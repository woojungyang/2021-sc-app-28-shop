'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const insertBoard = [];
    const insertFile = [];
    for (let i = 1; i <= 120; i++) {
      insertBoard.push({
        binit_id: i < 50 ? 1 : 2,
        user_id: i < 10 ? 1 : i,
        title: '데모 입니다' + i,
        writer: '데모 유저' + i,
        content: '데모 내용 입니다.' + i,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('Board', insertBoard);
    const files = [
      '211105_98636d98-0d41-4a93-8909-147cf70ff70a.jpg',
      '211105_a16e62ee-36ba-4745-8f82-29a5f30a95d5.jpg',
      '211105_ae7e10da-1952-4772-9c7e-ddc2fa10bcd4.jpg',
    ];
    for (let i = 50; i < 120; i++) {
      insertFile.push({
        board_id: i,
        oriName: '파일' + i + '.jpg',
        saveName: files[Math.floor(Math.random() * 3)],
        mimeType: 'image/jpg',
        fileType: 'I',
        size: 12369,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('BoardFile', insertFile);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Board', null, {});
  },
};
