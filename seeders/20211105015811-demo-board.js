'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const insertNotice = [];
    const insertGallery = [];
    for (let i = 1; i <= 120; i++) {
      insertNotice.push({
        binit_id: '1',
        user_id: 1,
        title: 'Notice ' + i,
        writer: 'Admin',
        content: 'Notice-test ' + i,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    for (let i = 1; i <= 120; i++) {
      insertGallery.push({
        binit_id: 2,
        user_id: (i % 100) + 1,
        title: 'Gallery ' + i,
        writer: 'testuser' + i,
        content: 'test ' + i,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('board', insertNotice);
    await queryInterface.bulkInsert('board', insertGallery);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('board', null, {});
  },
};
