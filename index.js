var express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const db = require('./db.js');

var PORT = process.env.PORT || 31918


//Konekcija na bazu
db.sequelize.sync()
  .then(() => console.log("Modul Student uspješno konektovan"))
  .catch((err) => console.log("Modul Stdudent nije konektovan! GRESKA:", err));

//Setovanje header-a
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Importovanje dostupnih ruta
var predmeti = require('./Routes/predmeti.js');
var ag = require('./Routes/akademskegodine.js');
var studenti = require('./Routes/studenti.js');
var zavrsni = require('./Routes/temezavrsni.js');
var profesori = require('./Routes/profesori.js');

var ugovori = require('./Routes/ugovori.js');
var ispiti = require('./Routes/ispiti.js');
var ocjene = require('./Routes/ocjene.js');
var prosjek = require('./Routes/prosjek.js');
var odsjek = require('./Routes/odsjek.js');
var zadace = require('./Routes/zadace.js');




//Definisanje koristenja dostupnih ruta
app.use('/predmeti', predmeti);
app.use('/akademskegodine', ag);
app.use('/studenti', studenti);
app.use('/temezavrsni', zavrsni);
app.use('/profesori', profesori);

app.use('/ugovori', ugovori);
app.use('/ispiti', ispiti);
app.use('/ocjene', ocjene);
app.use('/prosjek', prosjek);
app.use('/odsjek', odsjek);
app.use('/zadace', zadace);

app.get('/', function (req, res) {
  res.send("Modul deployan");
})

app.listen(PORT, function () { console.log('server successfully started on port ' + PORT); });
