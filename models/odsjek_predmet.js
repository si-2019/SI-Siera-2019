/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('odsjek_predmet', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    idOdsjek: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Odsjek',
        key: 'idodsjek'
      }
    },
    idPredmet: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Predmet',
        key: 'id'
      }
    },
    semestar: {
      type: DataTypes.ENUM('1','2'),
      allowNull: false
    },
    godina: {
      type: DataTypes.ENUM('1','2','3','4','5','6','7','8'),
      allowNull: false
    },
    obavezan: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    }
  }, {
    tableName: 'odsjek_predmet'
  });
};
