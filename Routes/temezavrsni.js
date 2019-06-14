var express = require('express');
var router = express.Router();
const db = require('../db.js');
const bodyParser = require('body-parser');
const axios = require('axios')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


//API za kreiranje zahtjeva za zavrsni rad
//Student odabire profesora i temu i salje zahtjev profesoru za tu temu


router.post('/:idStudent/:idTema', (req, res) => {

    axios.get('http://si2019oscar.herokuapp.com/pretragaId/' + req.params.idStudent + '/dajUlogu')
        .then(response => {
            //Ako nije null, ima ulogu
            if (response.data != null) {
                axios.get('http://si2019oscar.herokuapp.com/pretragaId/imaPrivilegiju/' + req.params.idStudent + '/rezervacija-teme')
                    .then(response => {
                        //Prosla autorizacija
                        if (response.data == true) {
                            try {
                                const student_id = req.params.idStudent;
                                const tema_id = req.params.idTema;

                                //Provjerava da li je ID studenta ispravan
                                db.Korisnik.count({
                                    where:
                                    {
                                        id: student_id
                                    }
                                }).then(broj => {
                                    if (broj == 0) {
                                        return res.status(404).send({
                                            userAutorizacija: true,
                                            success: false,
                                            message: 'Parameter idStudent not found'
                                        });
                                    }
                                    else {
                                        //Provjerava da li je ID Teme ispravan, i odmah kupi idProfesora
                                        db.TemeZavrsnih.findOne({
                                            where:
                                            {
                                                id: tema_id
                                            },
                                            attributes: ['id', 'idProfesora']

                                        }).then(result => {

                                            if (!result) {
                                                return res.status(404).send({
                                                    userAutorizacija: true,
                                                    success: false,
                                                    message: 'Parameter idTema not found'
                                                });
                                            }
                                            else {

                                                //Dodavanje zahtjeva u bazu uz provjeru da se ne doda duplikat

                                                db.ZahtjeviZavrsni.findOrCreate({
                                                    where: {
                                                        idTema: tema_id,
                                                        idStudent: student_id,
                                                        idProfesor: result.idProfesora
                                                    }
                                                }).then(([zahtjev, created]) => {
                                                    return res.status(201).send({
                                                        userAutorizacija: true,
                                                        success: true,
                                                        message: 'zahtjev added successfully',
                                                        zahtjev
                                                    })
                                                })
                                            }

                                        })
                                    }

                                })
                            }
                            catch (e) {
                                console.log("Backend error: " + e);
                                res.status(400).json({
                                    userAutorizacija: true,
                                    success: false,
                                    error: e
                                })
                            }
                        }
                        //Nema privilegiju
                        else {
                            res.json({
                                userAutorizacija: false,
                                success: false,
                                message: "Nema privilegiju"
                            })
                        }
                        //error privilegija
                    }).catch(error => {
                        console.log(error);
                        res.json({
                            userAutorizacija: false,
                            success: false
                        })
                    })
            }
            //Ne postoji id
            else {
                res.json({
                    userAutorizacija: false,
                    success: false,
                    message: "Ne postoji id"
                })
            }
        })
        // error uloga
        .catch(error => {
            console.log(error);
            res.json({
                userAutorizacija: false,
                success: false
            })
        });


});

router.get('/:idStudent', (req, res) => {
    axios.get('http://si2019oscar.herokuapp.com/pretragaId/' + req.params.idStudent + '/dajUlogu')
        .then(response => {
            //Ako nije null, ima ulogu
            if (response.data != null) {
                axios.get('http://si2019oscar.herokuapp.com/pretragaId/imaPrivilegiju/' + req.params.idStudent + '/pregled-statusa-teme')
                    .then(response => {
                        //Prosla autorizacija
                        if (response.data == true) {
                            try {
                                const student_id = req.params.idStudent;

                                //Provjerava da li je ID studenta ispravan
                                db.Korisnik.count({
                                    where:
                                    {
                                        id: student_id
                                    }
                                }).then(broj => {
                                    if (broj == 0) {
                                        return res.status(404).send({
                                            userAutorizacija: true,
                                            success: false,
                                            message: 'Parameter idStudent not found'
                                        });
                                    }
                                    else {

                                        db.sequelize.query("SELECT TemeZavrsnih.id, TemeZavrsnih.naziv, ZahtjeviZavrsni.odobreno FROM TemeZavrsnih, ZahtjeviZavrsni WHERE TemeZavrsnih.id=ZahtjeviZavrsni.idTema AND ZahtjeviZavrsni.idStudent=" + student_id).then(([results, metadata]) => res.status(200).send({
                                            userAutorizacija: true,
                                            success: true,
                                            teme: results
                                        }))
                                    }

                                })
                            }
                            catch (e) {
                                console.log("Backend error: " + e);
                                res.status(400).json({
                                    userAutorizacija: true,
                                    success: false,
                                    error: e
                                })
                            }
                        }
                        //Nema privilegiju
                        else {
                            res.json({
                                userAutorizacija: false,
                                success: false,
                                message: "Nema privilegiju"
                            })
                        }
                        //error privilegija
                    }).catch(error => {
                        console.log(error);
                        res.json({
                            userAutorizacija: false,
                            success: false
                        })
                    })
            }
            //Ne postoji id
            else {
                res.json({
                    userAutorizacija: false,
                    success: false,
                    message: "Ne postoji id"
                })
            }
        })
        // error uloga
        .catch(error => {
            console.log(error);
            res.json({
                userAutorizacija: false,
                success: false
            })
        });

});

module.exports = router;
