const fs = require('fs-extra');
const path = require('path');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const files = fs.readdirSync(path.join(__dirname, '../storages/201205'));
    files.splice(files.indexOf('thumb'), 1);
    const insertFile = [];
    for (let i = 1; i <= 120; i++) {
      for (let j = 0; j < 3; j++) {
        if (Math.floor(Math.random() * 2) === 0) {
          insertFile.push({
            board_id: i,
            oriName: `파일_${i}_${j}.jpg`,
            saveName: files[Math.floor(Math.random() * files.length)],
            mimeType: 'image/jpg',
            fileType: 'I',
            size: 12369,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }
    for (let i = 121; i <= 240; i++) {
      for (let j = 0; j < 5; j++) {
        if (Math.floor(Math.random() * 2) === 0) {
          insertFile.push({
            board_id: i,
            oriName: `파일_${i}_${j}.jpg`,
            saveName: files[Math.floor(Math.random() * files.length)],
            mimeType: 'image/jpg',
            fileType: 'I',
            size: 12369,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }
    for (let i = 1; i <= 3; i++) {
      insertFile.push({
        board_id: 241,
        oriName: '메인배너' + i + '.jpg',
        saveName: '201209_main' + i + '.jpg',
        mimeType: 'image/jpg',
        fileType: 'I',
        size: 12369,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    insertFile.push({
      board_id: 242,
      oriName: '패럴렉스배너.jpg',
      saveName: '201209_parallax.jpg',
      mimeType: 'image/jpg',
      fileType: 'I',
      size: 12369,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    insertFile.push({
      board_id: 243,
      oriName: '하단배너.jpg',
      saveName: '201210_243.jpg',
      mimeType: 'image/jpg',
      fileType: 'I',
      size: 12369,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    for (let i = 1; i <= 6; i++) {
      insertFile.push({
        board_id: 244,
        oriName: 'ride' + i + '.jpg',
        saveName: '201210_244-0' + i + '.jpg',
        mimeType: 'image/jpg',
        fileType: 'I',
        size: 12369,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    for (let i = 1; i <= 6; i++) {
      insertFile.push({
        board_id: 245,
        oriName: 'insta' + i + '.jpg',
        saveName: '201210_245-0' + i + '.jpg',
        mimeType: 'image/jpg',
        fileType: 'I',
        size: 12369,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    for (let i = 246, j = 1; i <= 10; i++, j++) {
      insertFile.push({
        board_id: i,
        oriName: 'brand' + i + '.jpg',
        saveName: '201204_' + (j < 10 ? '0' + j : j) + '.jpg',
        mimeType: 'image/jpg',
        fileType: 'I',
        size: 12369,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('boardfile', insertFile);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('boardfile', null, {});
  },
};
