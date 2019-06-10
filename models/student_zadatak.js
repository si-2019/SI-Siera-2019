/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('student_zadatak', {
    idStudentZadatak: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    idStudent: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    idZadatak: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'Zadatak',
        key: 'idzadatak'
      }
    },
    brojOstvarenihBodova: {
      type: "DOUBLE",
      allowNull: true
    },
    datumIVrijemeSlanja: {
      type: DataTypes.DATE,
      allowNull: true
    },
    velicinaDatoteke: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    komentar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tipDatoteke: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    datoteka: {
      type: "BLOB",
      allowNull: true
    },
    stanjeZadatka: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    nazivDatoteke: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'student_zadatak'
  });
};
