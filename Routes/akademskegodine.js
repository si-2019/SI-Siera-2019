
var express = require('express');
var router = express.Router();
const db = require('../db.js');

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

module.exports = router;