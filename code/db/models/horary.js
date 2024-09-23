const { DataTypes } = require("sequelize");

module.exports = model;
function model(sequelize) {
  const attributes = {
    diaSemana: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
          isIn: [['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']],
        },
      },
      horaInicio: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      horaFin: {
        type: DataTypes.TIME,
        allowNull: false,
      },
  };

  const options = {
    timestamps: false, // Desactivar timestamps
  };

  const _model = sequelize.define("Horary", attributes, options);

  return _model;
}
