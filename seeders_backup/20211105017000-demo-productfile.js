const fs = require('fs-extra');
const path = require('path');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const imgs = fs.readdirSync(path.join(__dirname, '../storages/201206'));
    const videos = fs.readdirSync(path.join(__dirname, '../storages/201207'));
    const details = fs.readdirSync(path.join(__dirname, '../storages/201208'));
    imgs.splice(imgs.indexOf('thumb'), 1);
    videos.splice(imgs.indexOf('thumb'), 1);
    details.splice(details.indexOf('thumb'), 1);
    const insertFile = [];
    for (let i = 1; i <= 100; i++) {
      for (let j = 1; j <= 5; j++) {
        let saveName = imgs[Math.floor(Math.random() * imgs.length)];
        if (Math.floor(Math.random() * 5) === 1 && j == 2) saveName = videos[0];
        if (Math.floor(Math.random() * 5) === 2 && j == 2) saveName = videos[1];
        insertFile.push({
          prd_id: i,
          oriName: `상품이미지_${i}_${j}.jpg`,
          saveName: saveName,
          mimeType: 'image/jpg',
          fileType: 'I',
          fieldNum: j,
          size: 12369,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      for (let j = 1; j <= 2; j++) {
        insertFile.push({
          prd_id: i,
          oriName: `상세이미지_${i}_${j}.jpg`,
          saveName: details[Math.floor(Math.random() * details.length)],
          mimeType: 'image/jpg',
          fileType: 'F',
          fieldNum: j,
          size: 12369,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    await queryInterface.bulkInsert('productfile', insertFile);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('productfile', null, {});
  },
};
