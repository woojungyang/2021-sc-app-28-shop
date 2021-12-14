const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const { Color } = require('../models');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const insertColorPrd = [];
    const rs = await Color.findAll();
    const colors = rs.map((v) => v.id);
    for (let i = 1; i <= 100; i++) {
      let color = _.shuffle(colors);
      let len = Math.floor(Math.random() * color.length);
      for (let j = 0; j < len; j++) {
        insertColorPrd.push({
          prd_id: i,
          color_id: color[j],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    await queryInterface.bulkInsert('color_product', insertColorPrd);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('color_product', null, {});
  },
};
