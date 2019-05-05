const Sequelize = require("sequelize");


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    port: 3306,
    define: {
        timestamps: false
    }
});

const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.predmet_student = sequelize.import(__dirname + '/models/predmet_student.js');
db.AkademskaGodina = sequelize.import(__dirname + '/models/AkademskaGodina.js');

module.exports = db;
