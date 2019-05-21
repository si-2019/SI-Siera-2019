var express = require('express');
var router = express.Router();
const db = require('../db.js');
const bodyParser = require('body-parser');
const compare = require('compare-dates');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/:idStudent', function (req, res, next) {

});

module.exports = router;