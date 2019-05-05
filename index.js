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
var ag = require('./Routes/akademskegodine.js');

app.use('/predmeti', predmeti);
app.use('/akademskegodine', ag);



app.listen(31918);