
var express = require('express');
var router = express.Router();
const db = require('../db.js');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Vracanje podataka za korisnika sa id-om idStudent
router.get('/:idStudent', function (req, res) {

    var stringic = [];
    var objekat;
    db.Korisnik.findAll({
        where: { id: req.params.idStudent }
    }).then(function (z) {

        //Pretvaranje blob objekta u sliku i kreiranje url-a iskoristivog za backend
        const blob = z[0].fotografija;

        try {
            var buffer = Buffer.from(blob);
            var bufferBase64 = buffer.toString('base64');
            var url = "data:image/png;base64," + buffer;
        }
        catch (error) {
            console.log(error);
            throw error;
        }

        // Kreiranje objekta student sa potrebnim informacijama
        z.forEach(student => {
            objekat = {
                id: student.id, ime: student.ime, prezime: student.prezime, adresa: student.adresa, ciklus: student.ciklus, datumRodjenja: student.datumRodjenja, drzavljanstvo: student.drzavljanstvo,
                email: student.email, fotografija: url, imePrezimeMajke: student.imePrezimeMajke, imePrezimeOca: student.imePrezimeOca, indeks: student.indeks, jmbg: student.jmbg,
                kanton: student.kanton, linkedin: student.linkedin, mjestoRodjenja: student.mjestoRodjenja, password: student.password, semestar: student.semestar, spol: student.spol,
                telefon: student.telefon, titula: student.titula, username: student.username, website: student.website, idOdsjek: student.idOdsjek, idUloga: student.idUloga
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

router.put('/update/drzavljanstvo/:idStudent', (req, res) => {

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
        if (!req.body.drzavljanstvo) {
            return res.status(400).send({
                success: 'false',
                message: 'drzavljanstvo is required',
            });
        }
        else {
            var drzavljanstvo = req.body.drzavljanstvo;
            db.sequelize.query("UPDATE Korisnik SET drzavljanstvo='" + drzavljanstvo + "' WHERE id=" + student_id).then(info => res.status(201).send({
                success: 'true',
                message: 'Korisnik updated successfully'
            }))
        }
    })
});

//PUT api za izmjenu adrese

router.put('/update/adresa/:idStudent', (req, res) => {

    var student_id = req.params.idStudent;

    //Provjera da li korisnik sa datim IDem postoji
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

        //Provjera da li se u body-u nalaze odgovarajući parametri sa novim vrijednostima
        if (!req.body.adresa) {
            return res.status(400).send({
                success: 'false',
                message: 'adresa is required',
            });
        }

        //Ako je sve uredu vrsi se izmjena
        else {
            var adresa = req.body.adresa;

            db.sequelize.query("UPDATE Korisnik SET adresa='" + adresa + "' WHERE id=" + student_id).then(info => res.status(201).send({
                success: 'true',
                message: 'Korisnik updated successfully'
            }))
        }

    })

});


//PUT api za izmjenu telefona

router.put('/update/tel/:idStudent', (req, res) => {

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

        if (!req.body.tel) {
            return res.status(400).send({
                success: 'false',
                message: 'tel is required',
            });
        }
        else {
            var tel = req.body.tel;

            db.sequelize.query("UPDATE Korisnik SET telefon='" + tel + "' WHERE id=" + student_id).then(info => res.status(201).send({
                success: 'true',
                message: 'Korisnik updated successfully'
            }))
        }

    })

});

//PUT api za izmjenu email adrese

router.put('/update/mail/:idStudent', (req, res) => {

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

        if (!req.body.mail) {
            return res.status(400).send({
                success: 'false',
                message: 'mail is required',
            });
        }
        else {
            var mail = req.body.mail;

            db.sequelize.query("UPDATE Korisnik SET email='" + mail + "' WHERE id=" + student_id).then(info => res.status(201).send({
                success: 'true',
                message: 'Korisnik updated successfully'
            }))
        }

    })

});

//PUT api za izmjenu linkedin linka

router.put('/update/linkedin/:idStudent', (req, res) => {

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

        if (!req.body.linkedin) {
            return res.status(400).send({
                success: 'false',
                message: 'linkedin is required',
            });
        }
        else {
            var linkedin = req.body.linkedin;

            db.sequelize.query("UPDATE Korisnik SET linkedin='" + linkedin + "' WHERE id=" + student_id).then(info => res.status(201).send({
                success: 'true',
                message: 'Korisnik updated successfully'
            }))
        }

    })

});

//PUT api za izmjenu website linka

router.put('/update/website/:idStudent', (req, res) => {

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

        if (!req.body.website) {
            return res.status(400).send({
                success: 'false',
                message: 'website is required',
            });
        }
        else {
            var website = req.body.website;

            db.sequelize.query("UPDATE Korisnik SET website='" + website + "' WHERE id=" + student_id).then(info => res.status(201).send({
                success: 'true',
                message: 'Korisnik updated successfully'
            }))
        }

    })

});

module.exports = router;

