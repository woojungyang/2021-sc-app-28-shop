const fs = require('fs-extra');
const path = require('path');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const insertColor = [];
    const color = fs.readJsonSync(path.join(__dirname, '../json/color.json'));
    var code = Object.keys(color);
    var name = Object.values(color);
    for (let i = 1; i <= 200; i++) {
      insertColor.push({
        id: i,
        name: name[i],
        code: code[i],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('color', insertColor);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('color', null, {});
  },
};
