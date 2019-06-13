var express = require('express');
var router = express.Router();
const db = require('../db.js');
const bodyParser = require('body-parser');
const compare = require('compare-dates');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/:idStudent', function (req, res, next) {


    try {
        //id studenta za koje trazimo ispite
        const student_id = req.params.idStudent;

        //glavni rezultat u kojeg ce se smjestat sve info, i koji ce biti vracen
        var akademskeGodine = []

        //Vraca listu svih akademskih godina koje postoje u bazi
        db.AkademskaGodina.findAll({

        }).then(godine => {

            for (var i = 0; i < godine.length; i++) {
                //Prolazi kroz vracene godine i dodaje jednu po jednu u rezultat
                akademskeGodine.push([{
                    idGodine: godine[i].id,
                    nazivGodine: godine[i].naziv,
                    predmeti: []
                }])
            }
            //Dohvata sve predmete koje je tudent slusao, bez obzira koja je akademska godina u pitanju
            db.sequelize.query("SELECT Predmet.id, Predmet.naziv, predmet_student.idAkademskaGodina from Predmet, predmet_student WHERE predmet_student.idStudent=" + student_id + " AND Predmet.id=predmet_student.idPredmet").then(([rezPredmeti, metadata]) => {

                //Prolazi kroz godine
                for (var i = 0; i < godine.length; i++) {
                    //Prolazi kroz vracene predmete
                    for (var j = 0; j < rezPredmeti.length; j++) {
                        //Kad se godina u kojoj je student slusao predmet poklapa sa nekom od godina u rezultatu, onda se taj predmet dodaje u rezultat
                        if (rezPredmeti[j].idAkademskaGodina == godine[i].id) {

                            akademskeGodine[i][0].predmeti.push({
                                idPredmet: rezPredmeti[j].id,
                                nazivPredmeta: rezPredmeti[j].naziv,
                                ispiti: []
                            })
                        }
                    }
                }
                //Pretrazuje sve ispite na koje je student izasao bez obzira na predmet i akademsku godinu
                db.sequelize.query("SELECT IspitBodovi.bodovi, Ispit.idPredmet, Ispit.tipIspita, Ispit.idIspit, Ispit.termin FROM IspitBodovi, Ispit WHERE IspitBodovi.idKorisnika=" + student_id + " AND Ispit.idIspit=IspitBodovi.idIspita").then(([rezIspiti, metadata]) => {

                    var ispiti = [];
                    //Prolazi kroz sve ispite kako bi im odredio akademsku godinu u kojoj su polagani
                    for (var i = 0; i < rezIspiti.length; i++) {
                        var datumIspita = new Date(rezIspiti[i].termin);

                        for (var j = 0; j < godine.length; j++) {
                            var datumPoc = new Date(godine[j].pocetak_zimskog_semestra);
                            var datumKraj = new Date(godine[j].kraj_ljetnog_semestra);
                            //Ako je ispit polagan izmedju datuma pocetka i kraja godine, odredjuje mu se id godine i smjesta u novi pomocni niz
                            if (compare.isBetween(datumIspita, datumPoc, datumKraj)) {
                                ispiti.push({
                                    idPredmet: rezIspiti[i].idPredmet,
                                    idIspita: rezIspiti[i].idIspit,
                                    nazivIspita: rezIspiti[i].tipIspita,
                                    bodovi: rezIspiti[i].bodovi,
                                    datum: datumIspita,
                                    idGodine: godine[j].id
                                })
                                //Ako ispit pripada jednoj godini nema potrebe vrtit petlju dalje
                                continue;
                            }
                        }
                    }

                    //Prolazi se kroz sve ispite
                    for (var i = 0; i < ispiti.length; i++) {
                        //Prolazi se kroz sve godine
                        for (var j = 0; j < godine.length; j++) {
                            //Kad je nadjena godina kojoj ispit pripada prolazi se kroz sve predmete te godine
                            if (ispiti[i].idGodine == godine[j].id) {
                                for (var k = 0; k < akademskeGodine[j][0].predmeti.length; k++) {
                                    //Trazi se predmet kojem ispit pripada
                                    if (ispiti[i].idPredmet == akademskeGodine[j][0].predmeti[k].idPredmet) {
                                        //Kad je nadjes dodaje se ispit tom predmetu na gore odredjenoj godini
                                        akademskeGodine[j][0].predmeti[k].ispiti.push({
                                            idIspita: ispiti[i].idIspita,
                                            nazivIspita: ispiti[i].nazivIspita,
                                            bodovi: ispiti[i].bodovi,
                                            datum: ispiti[i].datum
                                        })
                                        continue;
                                    }
                                }

                            }
                        }
                    }

                    res.status(200).json({
                        success: true,
                        akademskeGodine: akademskeGodine
                    })

                })
            })
        })
    }
    catch (e) {
        console.log("Backend error: " + e);
        res.status(400).json({
            success: false,
            error: e
        })
    }
});

module.exports = router;