const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const { Section } = require('../models');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const insertSectionPrd = [];
    const rs = await Section.findAll();
    const sections = rs.map((v) => v.id);
    for (let i = 1; i <= 100; i++) {
      let section = _.shuffle(sections);
      let len = Math.floor(Math.random() * section.length);
      for (let j = 0; j < len; j++) {
        insertSectionPrd.push({
          prd_id: i,
          section_id: section[j],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    await queryInterface.bulkInsert('section_product', insertSectionPrd);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('section_product', null, {});
  },
};
