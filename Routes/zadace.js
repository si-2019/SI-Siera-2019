var express = require('express');
var router = express.Router();
const db = require('../db.js');
const request = require('request');
const bodyParser = require('body-parser');
const assert = require('assert');
const axios = require('axios')

router.use(bodyParser.urlencoded({
    extended: true
}))

router.get('/:idStudent', function (req, res1) {
    try {

        const student_id = req.params.idStudent;
        var isp = [];
        var niz = [];
        var p = false;
        var t = false;
        db.Korisnik.count({
            where:
            {
                id: student_id
            }
        }).then(broj => {
            if (broj == 0) {
                return res1.status(404).send({
                    success: 'false',
                    message: 'Korisnik not found'
                });
            }
            else {

                //Slanje requesta da bi dobio predmete i bodove na zadace 
                request('http://localhost:31918/zadace/' + student_id + '/sort', function (err, res, body) {

                    var data = JSON.parse(body);
                    if (!data.ispiti) {
                        return res1.status(200).send({
                            succes: 'true',
                            message: 'Succesful',
                            ZadacePoGodinamaIPredmetima: []
                        })
                    }



                    // prolazak kroz predmete koje sam dobio u requ

                    for (var i = 0; i < data.ispiti.length; i++) {
                        var pom = i;

                        p = false;
                        //console.log("isp duzina:" + isp.length)
                        for (var j = 0; j < isp.length; j++) {

                            if (isp[j] == data.ispiti[i].naziv)
                                p = true;
                        }

                        //smjestanje u niz isp da bih nasao akademsku godinu za svaki od predmeta jednom
                        // p pomocna varijabla za provjeru da li se predmet nalazi u nizu
                        if (p == false) {
                            isp.push(data.ispiti[i].naziv);
                            // Prolajaz kroz petlju da bi se nasla godina u kojoj student ima ovaj predmet

                            db.sequelize.query("SELECT AkademskaGodina.naziv FROM Predmet, predmet_student, AkademskaGodina WHERE predmet_student.idStudent=" + student_id + " AND Predmet.id=predmet_student.idPredmet AND predmet_student.idAkademskaGodina=AkademskaGodina.id AND Predmet.naziv = '" + data.ispiti[i].naziv + "'").then(([godina, metadata]) => {
                                //t pomocna varijabla koja govori da li se akademska godina vec nalazi u finalnom nizu
                                t = false;
                                i = pom;

                                for (var k = 0; k < niz.length; k++) {
                                    // ako se vec nalazi u finalnom nizu updateuje se samo atribut zadace sa novim predmetom
                                    if (niz[k].AkademskaGodina == godina[0].naziv) {
                                        t = true;
                                        niz[k].Zadace.push({ Predmet: data.ispiti[i].naziv, Bodovi: data.ispiti[i].brojBodova })
                                    }
                                }

                                // ako se ne nalazi u finalnom nizu, dodaje se 

                                if (t == false) {


                                    niz.push({
                                        AkademskaGodina: godina[0].naziv,
                                        Zadace: { Predmet: data.ispiti[i].naziv, Bodovi: data.ispiti[i].brojBodova }
                                    });

                                }
                                if (data.ispiti.length - 1 == i) {
                                    //nakon sto se prodje kroz zadnji predmet u listi vraca se json
                                    res1.status(200).json({
                                        succes: 'true',
                                        message: 'Succesful',
                                        ZadacePoGodinamaIPredmetima: niz
                                    })
                                }
                            });
                        }

                    }
                });
            }
        });
    }
    catch (e) {
        res.status(400).json({
            succes: false,
            error: e
        })
    }
});

router.get('/:idStudent/sort', function (req, res) {

    axios.get('http://si2019oscar.herokuapp.com/pretragaId/' + req.params.idStudent + '/dajUlogu')
        .then(response => {
            //Ako nije null, ima ulogu
            if (response.data != null) {
                axios.get('http://si2019oscar.herokuapp.com/pretragaId/imaPrivilegiju/' + req.params.idStudent + '/pregled-statistike')
                    .then(response => {
                        //Prosla autorizacija
                        if (response.data == true) {
                            try {

                                const student_id = req.params.idStudent;
                                var predmeti = [];
                                var p = false;

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
                                            message: 'Korisnik not found'
                                        });
                                    }
                                    else {
                                        db.sequelize.query("SELECT Predmet.naziv, student_zadatak.brojOstvarenihBodova FROM student_zadatak, Zadatak, Zadaca, Predmet WHERE student_zadatak.idStudent=" + student_id + " AND Zadatak.idZadatak = student_zadatak.idZadatak AND Zadaca.idZadaca = Zadatak.idZadaca AND Predmet.id = Zadaca.idPredmet").then(([zadace, metadata]) => {
                                            if (zadace.length == 0) {
                                                return res.status(200).send({
                                                    userAutorizacija: true,
                                                    succes: true,
                                                    message: 'Jos nema podataka o zadacama studenta',
                                                });
                                            }
                                            for (var i = 0; i < zadace.length; i++) {
                                                p = false;
                                                for (var j = 0; j < predmeti.length; j++) {
                                                    if (zadace[i].naziv == predmeti[j].naziv) {
                                                        predmeti[j].brojBodova += zadace[i].brojOstvarenihBodova;
                                                        p = true;
                                                    }
                                                }
                                                if (p == false) {
                                                    predmeti.push({
                                                        naziv: zadace[i].naziv,
                                                        brojBodova: zadace[i].brojOstvarenihBodova
                                                    });
                                                }
                                                if (i == zadace.length - 1) {
                                                    predmeti.sort((a, b) => { a.brojBodova > b.brojBodova ? 1 : 0 })
                                                    return res.status(200).send({
                                                        userAutorizacija: true,
                                                        succes: true,
                                                        message: 'Succesful',
                                                        ispiti: predmeti
                                                    });
                                                }
                                            }

                                        });
                                    }
                                });
                            }
                            catch (e) {
                                res.status(400).json({
                                    userAutorizacija: true,
                                    succes: false,
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