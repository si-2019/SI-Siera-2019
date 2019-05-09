var express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const db = require('./db.js');


//Konekcija na bazu
db.sequelize.sync()
    .then(() => console.log("Modul Student uspješno konektovan"))
    .catch((err) => console.log("Modul Stdudent nije konektovan! GRESKA:", err));


//Importovanje dostupnih ruta
var predmeti = require('./Routes/predmeti.js');
var ag = require('./Routes/akademskegodine.js');
var studenti = require('./Routes/studenti.js');


//Definisanje koristenja dostupnih ruta
app.use('/predmeti', predmeti);
app.use('/akademskegodine', ag);
app.use('/studenti', studenti);



app.listen(31918);