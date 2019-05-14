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
    res.send('radi');


});

module.exports = router;