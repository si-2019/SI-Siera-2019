var express = require('express');
var router = express.Router();
const db = require('../db.js');

//Lista svih profesora u bazi

router.get('/', function(req,res){
    db.Korisnik.findAll({
        where:{
            idUloga:"3"
        }
    }).then(profesori=>res.json({
        error: false,
        data: profesori
    })).catch(error=>res.json({
        error: true,
        data: [],
        error:error
    }));
});




//Lista svih tema jednog profesora

router.get('/temeZavrsni/:idProfesor', function(req,res){
    const profesor_id = req.params.idProfesor

    db.Korisnik.count({
        where:{
            id:profesor_id
        }
    }).then(broj=>{
        if (broj == 0) {
            return res.status(404).send({
                success: 'false',
                message: 'Parameter idProfesor not found'
            });
        }
        else{
            db.TemeZavrsnih.findAll({
                where:{
                    idProfesora: profesor_id
                }
            }).then(profesori=>res.json({
                error: false,
                data: profesori
            })).catch(error=>res.json({
                error: true,
                data: [],
                error:error
            }));
        }
    })

    
})


module.exports = router;