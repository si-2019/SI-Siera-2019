var express = require('express');
var router = express.Router();
const db = require('../db.js');
const axios = require('axios');

router.get('/:idStudent', function (req, res, next) {


    axios.get('http://si2019oscar.herokuapp.com/pretragaId/' + req.params.idStudent + '/dajUlogu')
        .then(response => {
            //Ako nije null, ima ulogu
            if (response.data != null) {
                axios.get('http://si2019oscar.herokuapp.com/pretragaId/imaPrivilegiju/' + req.params.idStudent + '/pregled-odsjeka')
                    .then(response => {
                        //Prosla autorizacija
                        if (response.data == true) {
                            try {

                                db.Odsjek.findAll().then(odsjeci => {
                                    res.status(200).send({
                                        userAutorizacija: true,
                                        success: true,
                                        odsjeci: odsjeci
                                    })
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