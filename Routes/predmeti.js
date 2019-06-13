
var express = require('express');
var router = express.Router();
const db = require('../db.js');


//Pretraga svih predmeta koje student sluša

router.get('/:idStudent', function (req, res, next) {

    try {

        const student_id = req.params.idStudent;

        db.predmet_student.findAll({
            where: {
                idStudent: student_id
            }
        }).then(predmeti => res.json({
            success: true,
            error: false,
            data: predmeti
        }))
            .catch(error => res.json({
                success: false,
                error: true,
                data: [],
                error: error
            }));
    }
    catch (e) {
        console.log("Backend error: " + e);
        res.status(400).json({
            success: false,
            error: e
        })
    }
});

//Pretraga trenutnih predmeta

router.get('/trenutni/:idStudent', function (req, res, next) {

    var trenutna_id = 0;
    const student_id = req.params.idStudent;

    //Odredjivanje trenutne godine, jer tražimo predmete koje samo u trenutnoj godini

    db.AkademskaGodina.findOne({
        where: {
            aktuelna: "1"
        },
        attributes: ['id']
    }).then(trenutna => {

        //Dohvatanje imena trenutnih predmeta koje student sluša
        db.sequelize.query("SELECT Predmet.naziv FROM Predmet, predmet_student WHERE Predmet.id=predmet_student.idPredmet AND predmet_student.idStudent=" + student_id + " AND idAkademskaGodina=" + trenutna.id).then(([results, metadata]) => res.json({
            trenutniPredmeti: results
        }))

    })

});

//Pretraga predmeta koje je student odslušao

router.get('/odslusani/:idStudent', function (req, res, next) {

    var trenutna_id = 0;
    const student_id = req.params.idStudent;

    //Odredjivanje trenutne godine, jer tražimo sve predmete koji NISU u trenutnoj godini

    db.AkademskaGodina.findOne({
        where: {
            aktuelna: "1"
        },
        attributes: ['id']
    }).then(trenutna => {


        //Dohvatanje liste imena predmeta koje je student odslušao
        db.sequelize.query("SELECT Predmet.naziv FROM Predmet, predmet_student WHERE Predmet.id=predmet_student.idPredmet AND predmet_student.idStudent=" + student_id + " AND idAkademskaGodina!=" + trenutna.id).then(([results, metadata]) => res.json({
            odslusaniPredmeti: results
        }))

    })

});

router.get('/brojIspita/:idStudent/sort', function (req, res) {
    const student_id = req.params.idStudent;
    var isp = [];
    var p = false;
    db.Korisnik.count({
        where:
        {
            id: student_id
        }
    }).then(broj => {
        if (broj == 0) {
            return res.status(404).send({
                success: 'false',
                message: 'Korisnik not found'
            });
        }
        else {
            db.sequelize.query("SELECT DISTINCT Predmet.naziv FROM Predmet, IspitBodovi, predmet_student, Ispit WHERE  Ispit.idIspit = IspitBodovi.idIspita AND predmet_student.idStudent = " + student_id + " AND predmet_student.idPredmet = Ispit.idPredmet AND IspitBodovi.idKorisnika = " + student_id + " AND Predmet.id = predmet_student.idPredmet ORDER BY Predmet.naziv").then(([ispiti, metadata]) => {
                if (ispiti.length == 0) {
                    return res.status(200).send({
                        succes: 'true',
                        message: 'Korisnik nije polagao ni jedan ispit',
                    });
                }
                for (var i = 0; i < ispiti.length; i++) {
                    p = false;
                    for (var j = 0; j < isp.length; j++) {
                        if (ispiti[i].naziv == isp[j].naziv) {
                            isp[j].brojPolaganja++;
                            p = true;
                        }
                    }
                    if (p == false) {
                        isp.push({
                            naziv: ispiti[i].naziv,
                            brojPolaganja: 1
                        });
                    }
                    if (i == ispiti.length - 1) {
                        isp.sort((a, b) => { a.brojPolaganja > b.brojPolaganja ? 1 : 0 })
                        return res.status(200).send({
                            succes: 'true',
                            message: 'Succesful',
                            ispiti: isp
                        });
                    }
                }
            });
        }
    });
});

router.get('/:idOdsjek/:godina/:semestar', function (req, res, next) {

    const odsjek = req.params.idOdsjek;
    const god = req.params.godina;
    const sem = req.params.semestar;

    db.Odsjek.findAll({
        where: {
            idOdsjek: odsjek
        }
    }).then(result => {

        if (!result[0]) {
            return res.status(404).send({
                success: 'false',
                message: 'Odsjek not found- wrong id'
            });
        }
        else if (god < 1 || god > 8) {
            return res.status(400).send({
                success: 'false',
                message: 'Godina must be between 1 and 8'
            });
        }
        else if (sem < 1 || sem > 2) {
            return res.status(400).send({
                success: 'false',
                message: 'Semestar must be 1 for zimski or 2 for ljetni'
            });
        }
        else {
            db.sequelize.query("SELECT Predmet.naziv, odsjek_predmet.obavezan FROM Predmet, odsjek_predmet WHERE Predmet.id=odsjek_predmet.idPredmet AND odsjek_predmet.idOdsjek=" + odsjek + " AND odsjek_predmet.godina=" + god
                + " AND odsjek_predmet.semestar=" + sem).then(([results, metadata]) => res.status(200).send({
                    success: true,
                    dostupniPredmeti: results
                }))
        }

    })

});

module.exports = router;