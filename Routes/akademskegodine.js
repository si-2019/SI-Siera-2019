
var express = require('express');
var router = express.Router();
const db = require('../db.js');


//Lista svih akademskih godina u bazi

router.get('/', function (req, res, next) {

    db.AkademskaGodina.findAll().then(godine => res.json({
        error: false,
        data: godine
    }))
        .catch(error => res.json({
            error: true,
            data: [],
            error: error
        }));
});


//Trenutna akademska godina

router.get('/trenutna', function (req, res, next) {

    db.AkademskaGodina.findOne({
        where: {
            aktuelna: "1"
        }
    }).then(trenutna => res.json({
        error: false,
        data: trenutna
    }))
        .catch(error => res.json({
            error: true,
            data: [],
            error: error
        }));
});

module.exports = router;