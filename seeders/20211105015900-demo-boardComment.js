const fs = require('fs-extra');
const path = require('path');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const comments = [
      `Out of the water, I am nothing`,
      `My passion for surfing was more than my fear of sharks`,
      `I'm just a surfer who wanted to build something that would allow me to surf longer`,
      `If you're having a bad day, catch a wave`,
      'Never drive away from good surf.',
      `Foam is your friend. Don't be scared of it. A little bit of extra foam here and there is good for the soul and your surfing.`,
    ];
    const insertComment = [];
    for (let i = 1; i <= 240; i++) {
      let limitJ = Math.floor(Math.random() * 50) + 5;
      for (let j = 0; j < limitJ; j++) {
        insertComment.push({
          board_id: i,
          user_id: (i % 100) + 1,
          writer: 'demouser' + i,
          comment: comments[Math.floor(Math.random() * 6)],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    await queryInterface.bulkInsert('boardcomment', insertComment);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('boardcomment', null, {});
  },
};
