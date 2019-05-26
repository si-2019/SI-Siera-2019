var express = require('express');
var router = express.Router();
const db = require('../db.js');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.get('/ukupan/:idStudent', function (req, res, next) {

    const student_id = req.params.idStudent;

    db.predmet_student.findAll({
        where: {
            idStudent: student_id,
            ocjena: {
                [Op.ne]: null
            }
        },
        attributes: ['ocjena']
    }).then(ocjene => {
        var ukupno = 0;
        if (ocjene.length == 0) {
            res.json({
                success: true,
                prosjek: 0
            })
        }
        else {
            for (var i = 0; i < ocjene.length; i++) {

                ukupno += ocjene[i].ocjena;
            }

            res.status(200).json({
                success: true,
                prosjek: ukupno / ocjene.length
            })
        }
    })

})

module.exports = router;