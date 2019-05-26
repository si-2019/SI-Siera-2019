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

router.get('/:idStudent', function (req, res, next) {
    const student_id = req.params.idStudent;
    var nizProsjeka = [];

    db.sequelize.query("SELECT predmet_student.ocjena,odsjek_predmet.godina,odsjek_predmet.semestar FROM predmet_student, odsjek_predmet WHERE predmet_student.idStudent=" + student_id + " AND predmet_student.idPredmet=odsjek_predmet.idPredmet AND predmet_student.ocjena IS NOT NULL").then(([rez, metadata]) => {
        var ukupan = 0;
        var brojac = 0;
        for (var i = 1; i <= 8; i++) {
            var ukupnoGodina = 0
            var zimski = 0;
            var ljetni = 0;
            var brojacOcjena = 0;
            var brojacZimski = 0;
            var brojacLjetni = 0;
            for (var j = 0; j < rez.length; j++) {

                if (rez[j].godina == i && rez[j].semestar == 1) {
                    ukupnoGodina += rez[j].ocjena;
                    brojacOcjena++;
                    zimski += rez[j].ocjena;
                    brojacZimski++;
                }
                else if (rez[j].godina == i && rez[j].semestar == 2) {
                    ukupnoGodina += rez[j].ocjena;
                    brojacOcjena++;
                    ljetni += rez[j].ocjena;
                    brojacLjetni++;
                }
            }
            ukupan += ukupnoGodina + zimski + ljetni;
            brojac += brojacLjetni + brojacOcjena + brojacZimski;
            if (brojacOcjena == 0) {
                nizProsjeka.push({
                    prosjekGodina: 0,
                    zimski: 0,
                    ljetni: 0

                });
            }
            else if (brojacOcjena != 0 && zimski == 0) {
                nizProsjeka.push({
                    prosjekGodina: ukupnoGodina / brojacOcjena,
                    zimski: 0,
                    ljetni: ljetni / brojacLjetni

                });
            }
            else if (brojacOcjena != 0 && ljetni == 0) {
                nizProsjeka.push({
                    prosjekGodina: ukupnoGodina / brojacOcjena,
                    zimski: zimski / brojacZimski,
                    ljetni: 0

                });
            }
            else {

                nizProsjeka.push({
                    prosjekGodina: ukupnoGodina / brojacOcjena,
                    zimski: zimski / brojacZimski,
                    ljetni: ljetni / brojacLjetni

                });

            }
        }
        if (ukupan == 0) {
            res.status(200).json({
                success: true,
                ukupan: 0,
                prosjeci: nizProsjeka
            })
        }
        else {
            res.status(200).json({
                success: true,
                ukupan: ukupan / brojac,
                prosjeci: nizProsjeka
            })
        }

    })

})

module.exports = router;