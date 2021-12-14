module.exports = {
  up: async (queryInterface, Sequelize) => {
    const insertColor = [];
    const name = [
      'Light Grey',
      'Indigo Blue',
      'Pink',
      'Yellow Green',
      'Dark Grey',
      'Black',
      'White',
      'Light Cyan',
      'Orange',
      'Red',
      'Blue',
      'Green',
    ];
    const code = [
      '#808080',
      '#064384',
      '#cc0fa3',
      '#cde232',
      '#333333',
      '#000000',
      '#e6e6e6',
      '#35d5fd',
      '#f35d2b',
      '#dc0909',
      '#003ac2',
      '#1ba300',
    ];
    for (let i = 0; i < name.length; i++)
      insertColor.push({
        name: name[i],
        code: code[i],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    await queryInterface.bulkInsert('color', insertColor);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('color', null, {});
  },
};
