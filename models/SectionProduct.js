module.exports = (sequelize, { DataTypes, Op }) => {
  const SectionProduct = sequelize.define(
    'SectionProduct',
    {
      prd_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        allowNull: true,
      },
      section_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        allowNull: true,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'section_product',
    }
  );

  SectionProduct.associate = (models) => {
    SectionProduct.belongsTo(models.Section, {
      foreignKey: {
        name: 'section_id',
      },
      sourceKey: 'id',
      through: 'section_product',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    SectionProduct.belongsTo(models.Product, {
      foreignKey: {
        name: 'prd_id',
      },
      sourceKey: 'id',
      through: 'section_product',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };
  return SectionProduct;
};
