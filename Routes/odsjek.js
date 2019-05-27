var express = require('express');
var router = express.Router();
const db = require('../db.js');

router.get('/', function (req, res, next) {

    db.Odsjek.findAll().then(odsjeci => {
        res.status(200).send({
            success: true,
            odsjeci: odsjeci
        })
    })

});

module.exports = router;