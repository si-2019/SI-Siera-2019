
var express = require('express');
var router = express.Router();
const db = require('../db.js');

router.get('/:idStudent', function (req, res, next) {


    const student_id = req.params.idStudent;

    //Pretraga svih predmeta koje student sluša

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

    //Odredjivanje trenutne godine

    db.AkademskaGodina.findOne({
        where: {
            aktuelna: 1
        },
        attributes: ['id']
    }).then(trenutna => {
        console.log(trenutna.id);
        db.sequelize.query("SELECT Predmet.naziv FROM Predmet, predmet_student WHERE Predmet.id=predmet_student.idPredmet AND predmet_student.idStudent=" + student_id + " AND idAkademskaGodina=" + trenutna.id).then(([results, metadata]) => res.json({
            data: results
        }))

    })

});

router.get('/odslusani/:idStudent', function (req, res, next) {

    var trenutna_id = 0;
    const student_id = req.params.idStudent;

    //Odredjivanje trenutne godine

    db.AkademskaGodina.findOne({
        where: {
            aktuelna: 1
        },
        attributes: ['id']
    }).then(trenutna => {
        console.log(trenutna.id);
        db.sequelize.query("SELECT Predmet.naziv FROM Predmet, predmet_student WHERE Predmet.id=predmet_student.idPredmet AND predmet_student.idStudent=" + student_id + " AND idAkademskaGodina!=" + trenutna.id).then(([results, metadata]) => res.json({
            data: results
        }))

    })

});

module.exports = router;