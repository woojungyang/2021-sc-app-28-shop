module.exports = (sequelize) => {
  sequelize
    .sync({ force: false }) // 실제DBMNS랑 연동시켜줘
    .then(() => console.log('Sequelize Start!'))
    .catch((err) => console.log('Sequelize Error => ', err));
};
