var express = require('express');
var router = express.Router();
const db = require('../db.js');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


//API za kreiranje zahtjeva za zavrsni rad
//Student odabire profesora i temu i salje zahtjev profesoru za tu temu


router.post('/:idStudent/:idTema', (req, res) => {

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
                success: 'false',
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
                        success: 'false',
                        message: 'Parameter idTema not found'
                    });
                }

            })
        }

    })


});

module.exports = router;