var express = require('express');
var router = express.Router();
const db = require('../db.js');
const axios = require('axios')

//Lista svih profesora u bazi

router.get('/', function (req, res) {
    try {
        db.Korisnik.findAll({
            where: {
                idUloga: "3"
            }
        }).then(profesori => res.json({
            success: true,
            error: false,
            data: profesori
        })).catch(error => res.json({
            success: false,
            error: true,
            data: [],
            error: error
        }));
    }
    catch (e) {
        console.log("Backend error: " + e);
        res.status(400).json({
            success: false,
            error: e
        })
    }
});




//Lista svih tema jednog profesora

router.get('/temeZavrsni/:idProfesor/:idStudent', function (req, res) {

    axios.get('http://si2019oscar.herokuapp.com/pretragaId/' + req.params.idStudent + '/dajUlogu')
        .then(response => {
            //Ako nije null, ima ulogu
            if (response.data != null) {
                axios.get('http://si2019oscar.herokuapp.com/pretragaId/imaPrivilegiju/' + req.params.idStudent + '/pregled-tema')
                    .then(response => {
                        //Prosla autorizacija
                        if (response.data == true) {
                            try {

                                const profesor_id = req.params.idProfesor

                                db.Korisnik.count({
                                    where: {
                                        id: profesor_id
                                    }
                                }).then(broj => {
                                    if (broj == 0) {
                                        return res.status(404).send({
                                            userAutorizacija: true,
                                            success: false,
                                            message: 'Parameter idProfesor not found'
                                        });
                                    }
                                    else {
                                        db.TemeZavrsnih.findAll({
                                            where: {
                                                idProfesora: profesor_id
                                            }
                                        }).then(profesori => res.json({
                                            userAutorizacija: true,
                                            success: true,
                                            error: false,
                                            data: profesori
                                        })).catch(error => res.json({
                                            userAutorizacija: true,
                                            success: false,
                                            error: true,
                                            data: [],
                                            error: error
                                        }));
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
})


module.exports = router;