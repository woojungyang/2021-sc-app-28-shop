module.exports = {
  up: async (queryInterface, Sequelize) => {
    const insertSection = [];
    const name = ['Sale', 'Best', 'New', 'Bundle'];
    const color = ['#ff66c7', '#2dfb3b', '#5a6f0b', '#044271'];
    for (let i = 0; i < name.length; i++)
      insertSection.push({
        name: name[i],
        color: color[i],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    await queryInterface.bulkInsert('section', insertSection);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('section', null, {});
  },
};
