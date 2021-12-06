const axios = require('axios');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = [];
    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    );
    for (let i = 0, j = 0; i < 1000; i++, j++) {
      if (j === 100) j = 0;
      if (j % 3 === 0) {
        posts[j].body = '&lt;h2&gt;' + posts[j].body + '&lt;/h2&gt;';
      }
      products.push({
        title: posts[j].title.split(' ')[0] + ' ' + posts[j].title.split(' ')[1],
        priceOrigin: Math.floor(Math.random() * 300000) + 30000,
        priceSale: Math.floor(Math.random() * 300000) + 30000,
        summary: posts[j].title,
        content: posts[j].body,
        amount: j % 20 === 0 ? 0 : Math.floor(Math.random() * 1000),
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
