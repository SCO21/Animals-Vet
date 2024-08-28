const { DataTypes } = require("sequelize");

module.exports = model;
function model(sequelize) {
  const attributes = {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  };

  const options = {
    timestamps: false, // Desactivar timestamps
  };

  const _model = sequelize.define("tbl_appointments", attributes, options);

  _model.associate = function (models) {
    models.tbl_appointments.belongsTo(models.tbl_users, {
      as: "user",
      foreignKey: { name: "email", allowNull: false },
    });
  };

  return _model;
}
