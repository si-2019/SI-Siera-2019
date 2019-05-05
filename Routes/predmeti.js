
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

module.exports = router;