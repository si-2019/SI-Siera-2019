var express = require('express');
var router = express.Router();
const db = require('../db.js');


//Lista svih ocjena po akademskoj godini
router.get('/akademskaGodina/:idGodina', function (req, res) {
    const akademskaGodina_id = req.params.idGodina
    db.predmet_student.findAll({
        where:{
            idAkademskaGodina:akademskaGodina_id
        }
    }).then(ocjene=>res.json({
        error: false,
        data: ocjene
    })).catch(error=>res.json({
        error: true,
        data: [],
        error:error
    }));
});

//Lista svih ocjena po studentu
router.get('/student/:idStudenta', function (req, res) {
    const student_id = req.params.idStudenta
    db.predmet_student.findAll({
        where:{
            idStudent:student_id
        }
    }).then(ocjene=>res.json({
        error: false,
        data: ocjene
    })).catch(error=>res.json({
        error: true,
        data: [],
        error:error
    }));
});

//Lista svih ocjena po predmetu
router.get('/predmet/:idPredmeta', function (req, res) {
    const predmet_id = req.params.idPredmeta
    db.predmet_student.findAll({
        where:{
            idPredmet:predmet_id
        }
    }).then(ocjene=>res.json({
        error: false,
        data: ocjene
    })).catch(error=>res.json({
        error: true,
        data: [],
        error:error
    }));
});

module.exports = router;