
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

module.exports = router;