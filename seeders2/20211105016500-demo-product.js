const axios = require('axios');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = [];
    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    );
    for (let i = 0, j = 0; i < 100; i++, j++) {
      if (j === 100) j = 0;
      if (j % 3 === 0) {
        posts[j].body = '&lt;h2&gt;' + posts[j].body + '&lt;/h2&gt;';
      }
      let price = String(Math.floor(Math.random() * 90000) + 3000);
      price = Number(price.substr(0, price.length - 2) + '00');
      let priceSale = (price * (Math.floor(Math.random() * 3) + 7)) / 10;
      products.push({
        title: posts[j].title.split(' ')[0] + ' ' + posts[j].title.split(' ')[1],
        priceOrigin: price,
        priceSale: priceSale,
        summary: posts[j].title,
        content: posts[j].body,
        star: (Math.random() * 3 + 2).toFixed(1),
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
