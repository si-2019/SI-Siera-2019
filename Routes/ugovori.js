var express = require('express');
var router = express.Router();
const db = require('../db.js');
const bodyParser = require('body-parser');
const fs = require('fs');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/:idStudent', (req, res) => {

    const student_id = req.params.idStudent;

    var data = fs.readFileSync('ugovori/proba.pdf');
    var pdf = data.toString('base64');


    db.Ugovori.findAll({
        where: {
            idStudent: student_id
        }
    }).then(student => {

        if (!student[0]) {

            var normalizedDate = new Date(Date.now()).toLocaleString();
            db.sequelize.query("INSERT INTO Ugovori (idStudent, ugovor, datumKreiranja) VALUES (" + student_id + ",'" + pdf + "','" + normalizedDate + "')").then(info => res.status(200).send({
                success: 'true',
                message: 'Korisnik added successfully'
            }))
        }
        else {
            var normalizedDate = new Date(Date.now()).toLocaleString();
            //UPDATE NEST NE RADI
            db.sequelize.query("UPDATE Ugovori SET ugovor='" + pdf + "',datumKreiranja='" + normalizedDate + "'  WHERE idStudent=" + student_id).then(info => res.status(201).send({
                info: info,
                success: 'true',
                message: 'Korisnik updated successfully'
            }))

        }
    })


});


router.get('/url/:idStudent', (req, res) => {

    const student_id = req.params.idStudent;

    db.Ugovori.findAll({
        where: {
            idStudent: student_id
        }
    }).then(ugovor => {

        if (!ugovor[0]) {
            res.send({
                link: null
            })
        }
        else {
            var ug = ugovor[0].ugovor;
            var url = "data:application/pdf;base64," + ug;
            res.send(
                {
                    link: url
                })
        }
    })
});

module.exports = router;