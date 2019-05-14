
var express = require('express');
var router = express.Router();
const db = require('../db.js');


//Pretraga svih predmeta koje student sluša

router.get('/:idStudent', function (req, res, next) {


    const student_id = req.params.idStudent;

    db.predmet_student.findAll({
        where: {
            idStudent: student_id
        }
    }).then(predmeti => res.json({
        error: false,
        data: predmeti
    }))
        .catch(error => res.json({
            error: true,
            data: [],
            error: error
        }));
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