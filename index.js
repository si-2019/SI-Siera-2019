var express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const db = require('./db.js');


//Konekcija na bazu
db.sequelize.sync()
    .then(() => console.log("Modul Student uspješno konektovan"))
    .catch((err) => console.log("Modul Stdudent nije konektovan! GRESKA:", err));


var predmeti = require('./Routes/predmeti.js');


app.use('/predmeti', predmeti);



app.listen(31918);