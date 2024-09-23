const { DataTypes } = require("sequelize");

module.exports = model;
function model(sequelize) {
  const attributes = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Client', // Valor predeterminado
      validate: {
        isIn: [['Client', 'Vet', 'Secretary']], // Validación para permitir solo estos valores
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };

  return sequelize.define("tbl_users", attributes, {});
}
