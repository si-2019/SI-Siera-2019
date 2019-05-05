/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AkademskaGodina', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    naziv: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    aktuelna: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    }
  }, {
    tableName: 'AkademskaGodina'
  });
};
