
var express = require('express');
var router = express.Router();
const db = require('../db.js');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Vracanje podataka za korisnika sa id-om idStudent
router.get('/:idStudent', function (req, res) {

        var stringic = [];
        var objekat;
        db.Korisnik.findAll({
            where: {id : req.params.idStudent}
        }).then(function(z){

        // Kreiranje objekta student sa potrebnim informacijama
        z.forEach(student => {
            objekat = { id: student.id, ime: student.ime, prezime: student.prezime, adresa: student.adresa, ciklus: student.ciklus, datumRodjenja: student.datumRodjenja, drzavljanstvo: student.drzavljanstvo,
            email: student.email, fotografija: student.fotografija, imePrezimeMajke: student.imePrezimeMajke, imePrezimeOca: student.imePrezimeOca, indeks: student.indeks, jmbg: student.jmbg,
            kanton: student.kanton, linkedin: student.linkedin, mjestoRodjenja: student.mjestoRodjenja, password: student.password, semestar: student.semestar, spol: student.spol,
            telefon: student.telefon, titula:student.titula, username: student.username, website: student.website, idOdsjek: student.idOdsjek, idUloga: student.idUloga
        };
            stringic.push(objekat);
        });
        // slanje podataka u json-u
        res.send(JSON.stringify(stringic));
    }).catch(error => res.json({
        error: true,
        data: [],
        error: error
    }));
});


router.put('/update/imeprezime/:idStudent', (req, res) => {

    var student_id = req.params.idStudent;

    db.Korisnik.findAll({
        where: {
            id: student_id
        },
        attributes: ['id']
    }).then(student => {

        if (student.length == 0) {
            return res.status(404).send({
                success: 'false',
                message: 'Korisnik not found'
            });
        }

        if (!req.body.ime) {
            return res.status(400).send({
                success: 'false',
                message: 'ime is required',
            });
        } else if (!req.body.prezime) {
            return res.status(400).send({
                success: 'false',
                message: 'prezime is required',
            });
        }
        else {
            var ime = req.body.ime;
            var prezime = req.body.prezime;
            db.sequelize.query("UPDATE Korisnik SET ime='" + ime + "', prezime='" + prezime + "' WHERE id=" + student_id).then(info => res.status(201).send({
                success: 'true',
                message: 'Korisnik updated successfully'
            }))
        }

    })
});

module.exports = router;

