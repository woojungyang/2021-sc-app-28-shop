'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const insertNotice = [];
    const insertGallery = [];
    for (let i = 1; i <= 120; i++) {
      insertNotice.push({
        binit_id: '1',
        user_id: 1,
        title: '공지사항 입니다. ' + i,
        writer: '최고관리자',
        content: '공지사항 내용 입니다. ' + i,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    for (let i = 1; i <= 120; i++) {
      insertGallery.push({
        binit_id: 2,
        user_id: (i % 100) + 1,
        title: '갤러리 데모 입니다. ' + i,
        writer: '데모 유저' + i,
        content: '데모 내용 입니다. ' + i,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    insertGallery.push({
      binit_id: 3,
      user_id: 1,
      title: '메인 상단 배너 입니다. ',
      writer: '우정양',
      content:
        'New Arrivals|$399|Quisquemos sodales suscipit tortor condimentum de cosmo lacus meleifend menean blanditos.|/prd/1|L^^Best Production|$599|Quisquemos sodales suscipit tortor condimentum de cosmo lacus meleifend menean blanditos. suscipit tortor condimentum de cosmo|/prd/1|C^^Favorite Surf|$1,299|Sodales suscipit tortor condimentum de cosmo lacus meleifend menean blanditos. suscipit tortor condimentum de cosmo|/prd/3|R',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    insertGallery.push({
      binit_id: 3,
      user_id: 1,
      title: '메인 패럴렉스 이미지 입니다. ',
      writer: '우정양',
      content:
        'Stand Up Paddle Board|$499|Quisquemos sodales suscipit tortor condimentum de cosmo lacus meleifend menean blanditos.|/prd/4|R',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await queryInterface.bulkInsert('board', insertNotice);
    await queryInterface.bulkInsert('board', insertGallery);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('board', null, {});
  },
};
