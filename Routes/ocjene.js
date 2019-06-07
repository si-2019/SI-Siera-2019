var express = require('express');
var router = express.Router();
const db = require('../db.js');


//Lista svih ocjena po studentu
router.get('/:idStudenta', function (req, res) {
    
    const studnet_id = req.params.idStudenta;


    var ocjeneniz = []
    var brojac=0;

    console.log("aaaaaa")

    db.sequelize.query("SELECT DISTINCT predmet_student.idAkademskaGodina, AkademskaGodina.naziv FROM predmet_student, AkademskaGodina WHERE predmet_student.idStudent=" + studnet_id + " AND predmet_student.idAkademskaGodina = AkademskaGodina.id ORDER BY AkademskaGodina.naziv").then(([godine,metadata])=>{
        for(var i=0; i<godine.length; i++){
            
            var ak_id=godine[i].idAkademskaGodina

            

            db.sequelize.query("SELECT Predmet.naziv AS Predmet, predmet_student.ocjena AS Ocjena FROM Predmet, predmet_student WHERE predmet_student.idStudent=" + studnet_id + " AND Predmet.id=predmet_student.idPredmet AND predmet_student.idAkademskaGodina="+ak_id).then(([ocjene,metadata])=>{

                ocjeneniz.push ([{
                    AkademskaGodina : godine[brojac].naziv,
                    Ocjene : []
                    
                }]) 

                for(var j=0; j<ocjene.length; j++){
                    ocjeneniz[brojac][0].Ocjene.push({
                        Predmet: ocjene[j].Predmet,
                        Ocjena: ocjene[j].Ocjena
                    })
                }
                brojac++
                if(brojac==godine.length){
                    res.status(200).json({
                        ocjene: ocjeneniz
                    })
                }
                
            })
        }

        
    })
  
});



module.exports = router;