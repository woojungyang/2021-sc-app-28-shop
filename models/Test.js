module.exports = (sequelize, DataType) => {
  const Test = sequelize.define(
    "Test",
    {
      name: {
        type: DataType.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
      tableName: "test",
      timestamps: true,
      paranoid: true,
    }
  );

  return Test;
};
