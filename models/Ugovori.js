/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Ugovori', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    idStudent: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Korisnik',
        key: 'id'
      }
    },
    ugovor: {
      type: "LONGBLOB",
      allowNull: false
    },
    datumKreiranja: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
      tableName: 'Ugovori'
    });
};
