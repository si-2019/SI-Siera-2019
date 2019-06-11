/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Zadatak', {
    idZadatak: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    idZadaca: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'Zadaca',
        key: 'idzadaca'
      }
    },
    redniBrojZadatkaUZadaci: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    maxBrojBodova: {
      type: "DOUBLE",
      allowNull: true
    }
  }, {
    tableName: 'Zadatak'
  });
};
