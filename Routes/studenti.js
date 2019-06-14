var express = require('express');
var router = express.Router();
const db = require('../db.js');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Vracanje podataka za korisnika sa id-om idStudent
router.get('/:idStudent', function (req, res) {

    //Autorizacija, provjera da li je korisnik student
    axios.get("http://si2019oscar.herokuapp.com/pretragaId/imaUlogu/" + req.params.idStudent + "/STUDENT").then(response => {
        if (response.data == true) {
            try {

                var stringic = [];
                var objekat;
                db.Korisnik.findAll({
                    where: { id: req.params.idStudent }
                }).then(function (z) {

                    //Pretvaranje blob objekta u sliku i kreiranje url-a iskoristivog za backend
                    const blob = z[0].fotografija;
                    var url = "";

                    if (blob != null) {
                        var buffer = Buffer.from(blob);
                        url = "data:image/png;base64," + buffer;
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
                    res.json({
                        userAutorizacija: true,
                        success: true,
                        user: stringic
                    })
                    //Ispod error baza
                }).catch(error => res.json({
                    userAutorizacija: true,
                    success: false,
                    error: true,
                    data: [],
                    error: error
                }));
            }
            //Ispod bilo kakav error
            catch (e) {
                console.log("Backend error: " + e);
                res.status(400).json({
                    userAutorizacija: true,
                    success: false,
                    error: e
                })
            }
        }
        //ispod regularno ne valja uloga
        else {
            res.status(200).json({
                userAutorizacija: false,
                success: false
            })
        }

    })
        //ispod error kod autorizacija APIa
        .catch(error => {
            console.log(error);
            res.json({
                userAutorizacija: false,
                success: false
            })
        });

});


router.put('/update/imeprezime/:idStudent', (req, res) => {
    try {

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
    }
    catch (e) {
        console.log("Backend error: " + e);
        res.status(400).json({
            success: false,
            error: e
        })
    }
});

router.put('/update/drzavljanstvo/:idStudent', (req, res) => {
    try {
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
    }
    catch (e) {
        console.log("Backend error: " + e);
        res.status(400).json({
            success: false,
            error: e
        })
    }
});

//PUT api za izmjenu adrese

router.put('/update/adresa/:idStudent', (req, res) => {
    try {

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
    }
    catch (e) {
        console.log("Backend error: " + e);
        res.status(400).json({
            success: false,
            error: e
        })
    }

});


//PUT api za izmjenu telefona

router.put('/update/tel/:idStudent', (req, res) => {
    try {
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
    }
    catch (e) {
        console.log("Backend error: " + e);
        res.status(400).json({
            success: false,
            error: e
        })
    }

});

//PUT api za izmjenu email adrese


router.put('/update/mail/:idStudent', (req, res) => {
    try {
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
    }
    catch (e) {
        console.log("Backend error: " + e);
        res.status(400).json({
            success: false,
            error: e
        })
    }


});

//PUT api za izmjenu linkedin linka

router.put('/update/linkedin/:idStudent', (req, res) => {

    try {
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
    }
    catch (e) {
        console.log("Backend error: " + e);
        res.status(400).json({
            success: false,
            error: e
        })
    }

});

//PUT api za izmjenu website linka

router.put('/update/website/:idStudent', (req, res) => {
    try {

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
    }
    catch (e) {
        console.log("Backend error: " + e);
        res.status(400).json({
            success: false,
            error: e
        })
    }
});

//Koristimo multer za spremanje lokalno slike koja se upload-a za izmjenu

//Odabir foldera i imena za spremanje
//Ime moze biti uvijek isto jer lokalnu kopiju koristimo samo za kodiranje i spremanje u bazu

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {

        cb(null, 'novaSlika');
    }
})

//Dodavanje ograncicenja na velicinu i tip
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 60
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        }
        else {
            cb('wrong mimetype', false);
        }
    }
})

router.put('/update/foto/:idStudent', upload.single('foto'), (req, res) => {

    try {
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
            else {

                //Cita spremljenu sliku i konvertuje je tako da bude pogodna za snimanje u bazu kao blob objekat
                var data = fs.readFileSync('uploads/novaSlika');
                var foto = data.toString('base64');

                //Konacan upit na bazu koji mijenja sliku
                db.sequelize.query("UPDATE Korisnik SET fotografija='" + foto + "' WHERE id=" + student_id).then(info => res.status(201).send({
                    success: 'true',
                    message: 'Korisnik updated successfully',
                    fotografija: foto
                }))
            }
        })
    }
    catch (e) {
        console.log("Backend error: " + e);
        res.status(400).json({
            success: false,
            error: e
        })
    }
});

module.exports = router;

