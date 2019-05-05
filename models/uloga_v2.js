/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('uloga_v2', {
    id_uloga: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    naziv: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'uloga_v2'
  });
};
