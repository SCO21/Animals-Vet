const { DataTypes } = require("sequelize");

module.exports = model;
function model(sequelize) {
  const attributes = {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
  };

  const options = {
    timestamps: false, // Desactivar timestamps
  };

  const _model = sequelize.define("medical_supply", attributes, options);

  return _model;
}
