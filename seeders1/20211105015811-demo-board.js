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
        user_id: (i % 45) + 1,
        title: '갤러리 데모 입니다. ' + i,
        writer: '데모 유저' + i,
        content: '데모 내용 입니다. ' + i,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    insertGallery.push({
      // 241
      binit_id: 4,
      user_id: 1,
      title: '메인 상단 배너 입니다. ',
      writer: '최고관리자',
      content:
        'New Arrivals|$399|Quisquemos sodales suscipit tortor condimentum de cosmo lacus meleifend menean blanditos.|/prd/1|L^^Best Production|$599|Quisquemos sodales suscipit tortor condimentum de cosmo lacus meleifend menean blanditos. suscipit tortor condimentum de cosmo|/prd/1|C^^Favorite Surf|$1,299|Sodales suscipit tortor condimentum de cosmo lacus meleifend menean blanditos. suscipit tortor condimentum de cosmo|/prd/3|R',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    insertGallery.push({
      // 242
      binit_id: 4,
      user_id: 1,
      title: '메인 패럴렉스 이미지 입니다. ',
      writer: '최고관리자',
      content:
        'Stand Up Paddle Board|$499|Quisquemos sodales suscipit tortor condimentum de cosmo lacus meleifend menean blanditos.|/prd/4|R',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    insertGallery.push({
      // 243
      binit_id: 4,
      user_id: 1,
      title: '하단배너',
      writer: '최고관리자',
      content:
        'Let Surf!|Starting at 0% APR|Quisquemos sodales suscipit tortor condimentum de cosmo lacus meleifend menean blanditos.|/prd/5|R',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    insertGallery.push({
      // 244
      binit_id: 4,
      user_id: 1,
      title: 'Ride List',
      writer: '최고관리자',
      content:
        '1|Viet Nam|Next trip: 10 May 2021 / 2 - 4 Weeks^^ 2|Thailand|Next trip: 11 May 2021 / 2 - 4 Weeks^^ 3|Indonesia|Next trip: 12 May 2021 / 2 - 4 Weeks^^ 4|Viet Nam|Next trip: 10 May 2021 / 2 - 4 Weeks^^ 5|Thailand|Next trip: 11 May 2021 / 2 - 4 Weeks^^ 6|Indonesia|Next trip: 12 May 2021 / 2 - 4 Weeks',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    insertGallery.push({
      // 245
      binit_id: 4,
      user_id: 1,
      title: 'Insta List',
      writer: '최고관리자',
      content: `1|4.5|Nam tempus turpis at metus cosmo scelerisque placerat nulla deumantos solicitud de felis. Quisquemos sodales suscipit tortor condimentum. Pellentesque diam delos...|- John Smith, @john_smith97, Australia^^ 2|3.5|Nam tempus turpis at metus cosmo scelerisque placerat nulla deumantos solicitud de felis. Quisquemos sodales suscipit tortor condimentum. Pellentesque diam delos...|- John Smith, @john_smith98, Australia^^ 3|4.6|Nam tempus turpis at metus cosmo scelerisque placerat nulla deumantos solicitud de felis. Quisquemos sodales suscipit tortor condimentum. Pellentesque diam delos...|- John Smith, @john_smith99, Australia^^ 4|4.7|Nam tempus turpis at metus cosmo scelerisque placerat nulla deumantos solicitud de felis. Quisquemos sodales suscipit tortor condimentum. Pellentesque diam delos...|- John Smith, @john_smith95, Australia^^ 5|4.4|Nam tempus turpis at metus cosmo scelerisque placerat nulla deumantos solicitud de felis. Quisquemos sodales suscipit tortor condimentum. Pellentesque diam delos...|- John Smith, @john_smith94, Australia^^ 6|4.8|Nam tempus turpis at metus cosmo scelerisque placerat nulla deumantos solicitud de felis. Quisquemos sodales suscipit tortor condimentum. Pellentesque diam delos...|- John Smith, @john_smith93, Australia`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    for (let i = 0; i < 10; i++) {
      insertGallery.push({
        // 246 ~ 255
        binit_id: 3,
        user_id: 1,
        title: '관계사' + i,
        writer: '최고관리자',
        content: '/',
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
