const axios = require('axios');
const titles = [
  `Surfing's one of the few sports that you look ahead to see what's behind.`,
  `A big wave is like a beautiful woman, exciting to look at and thrilling to ride.`,
  `The biggest sin in the world would be if I lost my love for the ocean.`,
  `There is no one right way to ride a wave.`,
  `There are a million ways to surf, and as long as you're smiling, you're doing it right.`,
  `Wiping out is an underappreciated skill`,
];
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = [];
    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    );
    for (let i = 0; i < posts.length; i++) {
      if (i % 3 === 0) {
        posts[i].body = '&lt;h2&gt;' + posts[i].body + '&lt;/h2&gt;';
      }
      products.push({
        title: titles[Math.floor(Math.random() * 5)] + '_' + i,
        priceOrigin: Math.floor(Math.random() * 300000) + 30000,
        priceSale: Math.floor(Math.random() * 300000) + 30000,
        summary: posts[i].title,
        content: posts[i].body,
        amount: i % 20 === 0 ? 0 : Math.floor(Math.random() * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('product', products);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product', null, {});
  },
};
