const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const router = express.Router();
const db = require('../db.js');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

function celija(doc, x, y, width, height) {
    doc.lineJoin('miter')
        .rect(x, y, width, height)
        .stroke()
    return doc
}

function upisiTextUCelijuBold(doc, text, width, heigth) {
    doc.y = heigth;
    doc.x = width;
    doc.fillColor('black')
        .fontSize(10)
        .font('Times-Bold')
    doc.text(text);
    return doc
}

function upisiTextUCeliju(doc, text, width, heigth) {
    doc.y = heigth;
    doc.x = width;
    doc.fillColor('black')
        .fontSize(10)
        .font('Times-Roman')
    doc.text(text);
    return doc
}

function upisiTextUCeliju(doc, text, width, heigth) {
    doc.y = heigth;
    doc.x = width;
    doc.fillColor('black')
        .fontSize(10)
        .font('Times-Roman')
    doc.text(text);
    return doc
}


function kreirajZaglavlje(doc, req) {
    doc.fillColor('#2D74CF')
        .fontSize(18)
        .text('Elektrotehnicki fakultet u Sarajevu', 75, 20, { align: 'center' });

    doc.image('logo.png', doc.page.width / 2 - 25, 45, { fit: [50, 50], align: 'center', valign: 'center' })
        .fontSize(16)
        .text('Ugovor o ucenju', 75, 100, { align: 'center' });

    var osnovniPodaci = [["Univerzitet", "UNIVERZITET U SARAJEVU", "Akademska godina:", new Date().getFullYear()], ["Naziv maticne institucije:", "ELEKTROTEHNICKI FAKULTET",
        "Godina studija:", `${req.body.godina}.`], ["Odsjek i ciklus studija:", `${req.body.odsjek} / ${req.body.ciklus}. ciklus`, "Semestar:", `${req.body.semestar}.`]];

    // Kreiranje osnovnih podataka
    var x = 50;
    var y = 130;
    var duzina = 150;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 4; j++) {

            if (j === 0 || j === 2)
                upisiTextUCelijuBold(doc, osnovniPodaci[i][j], x + 3, y + 3);
            else if (j === 1 || j === 3)
                upisiTextUCeliju(doc, osnovniPodaci[i][j], x + 3, y + 3);

            if (j == 3)
                celija(doc, x, y, duzina - 88, 15);
            else
                celija(doc, x, y, duzina, 15);
            x += 150;
        }
        duzina = 150;
        x = 50;
        y = y + 15;
    }

    celija(doc, 50, 190, 256, 15); celija(doc, 306, 190, 256, 15);
    celija(doc, 50, 205, 256, 15); celija(doc, 306, 205, 256, 15);
    upisiTextUCelijuBold(doc, "Ime i prezime: ", 53, 193);
    upisiTextUCeliju(doc, req.body.ime + " " + req.body.prezime, 309, 193);
    upisiTextUCelijuBold(doc, "Indeks: ", 53, 211);
    upisiTextUCeliju(doc, req.body.indeks, 309, 211);

}

function kreirajTabeluPredmeta(doc, req) {
    var y = 250;
    var obavezni = req.body['obavezni'].split(',');
    var izborni = req.body['izborni'].split(',');

    for (var i = 0; i < 12; i++) {
        celija(doc, 50, y, 512, 15);
        if (i < 8) {
            if (i == 0) {
                doc.font('Times-Bold')
                    .text('Obavezni predmeti', 75, y + 3, { align: 'center' })
            }
            else {
                if (obavezni[i - 1]) {
                    doc.font('Times-Roman')
                        .text(obavezni[i - 1], 75, y + 3, { align: 'center' })
                }
            }
        }
        else {
            if (i == 8) {
                doc.font('Times-Bold')
                    .text('Izborni predmeti', 75, y + 3, { align: 'center' })
            }
            else {
                if (izborni[i - 9]) {
                    doc.font('Times-Roman')
                        .text(izborni[i - 9], 75, y + 3, { align: 'center' })
                }
            }
        }
        y += 15;
    }
}

router.post('/kreiraj/:idStudent', (req, res) => {

    const doc = new PDFDocument;
    doc.pipe(fs.createWriteStream(__dirname + '/Ugovori/' + req.params.idStudent + "st.pdf"));
    kreirajZaglavlje(doc, req);

    // Clanovi

    var clanovi = [`Student se obavezuje na izvrsavanej svih obaveza predvidjenih planom i programom studija koji upisuje kao i na postivanje svih obaveza predvidjenih pravilima studiranja za ${req.body.ciklus}. ciklus studija na visokoskolskoj ustanovi.`,
        "Student se dalje obavezuje na postivanje discipline, kucnog reda i cuvanje imovine visokoskolske ustanove u skladu sa njenim pravilnicima. U slucaju materijalne stete, student je obavezan da istu nadoknadi.",
        "Maticna institucija ce omoguciti studentu da prati i polaze ispite na modulima koje je izabrao/la u tabelama koje su sastavni dio ovog ugovora. Ukoliko izabrani izborni modul ne zadovolji kriterij minimalnog broja kandidata koji su ga izabrali, studentu ce biti ponudjeno da izabere izborne module koji su zadovoljili pomenuti kriterij.",
        "Svi eventualni sporovi izmedju ugovornih strana ce se rijesavati u duhu medjusobnog uvazavanja i postovanja, a u skladu sa visokim etickim standardima akademske zajednice. U slucaju sporova koji ne mogu biti rijeseni ovim putem, obadvije strane prihvataju nadleznost Suda u Sarajevu."];




    celija(doc, 50, 250, 512, 50);

    doc.fontSize(11)
        .font('Times-Bold')
        .text('Clan 1.', 75, 255, { align: 'center' })
        .font('Times-Roman')
        .fontSize(10)
        .text(`${clanovi[0]}`, 53, 270);

    celija(doc, 50, 330, 512, 50);
    doc.fontSize(11)
        .font('Times-Bold')
        .text('Clan 2.', 75, 335, { align: 'center' })
        .font('Times-Roman')
        .fontSize(10)
        .text(`${clanovi[1]}`, 53, 350);

    celija(doc, 50, 410, 512, 60);
    doc.fontSize(11)
        .font('Times-Bold')
        .text('Clan 3.', 75, 415, { align: 'center' })
        .font('Times-Roman')
        .fontSize(10)
        .text(`${clanovi[2]}`, 53, 430);

    celija(doc, 50, 500, 512, 60);
    doc.fontSize(11)
        .font('Times-Bold')
        .text('Clan 4.', 75, 505, { align: 'center' })
        .font('Times-Roman')
        .fontSize(10)
        .text(`${clanovi[3]}`, 53, 520);

    celija(doc, 50, 580, 256, 30); celija(doc, 306, 580, 256, 30);
    upisiTextUCelijuBold(doc, "Potpis studenta: ", 55, 590);
    upisiTextUCeliju(doc, "Datum: ", 311, 590);
    celija(doc, 50, 630, 512, 15);
    upisiTextUCelijuBold(doc, "Maticna institucija: potvrdjujemo da je predlozeni program studiranja/ugovor o ucenju prihvacen.", 55, 633);
    celija(doc, 50, 645, 256, 20); celija(doc, 306, 645, 256, 20);
    upisiTextUCelijuBold(doc, "Potpis ECTS koordinatora institucije: ", 55, 650);
    upisiTextUCelijuBold(doc, "Potpis dekana institucije: ", 311, 650);
    celija(doc, 50, 665, 256, 20); celija(doc, 306, 665, 256, 20);
    upisiTextUCeliju(doc, "Datum: ", 55, 670);
    upisiTextUCeliju(doc, "Datum: ", 311, 670);

    doc.addPage();

    kreirajZaglavlje(doc, req);
    kreirajTabeluPredmeta(doc, req);

    celija(doc, 50, 440, 256, 30); celija(doc, 306, 440, 256, 30);
    upisiTextUCelijuBold(doc, "Potpis studenta: ", 55, 450);
    upisiTextUCeliju(doc, "Datum: ", 311, 450);
    celija(doc, 50, 480, 256, 20); celija(doc, 306, 480, 256, 20);
    upisiTextUCelijuBold(doc, "Potpis ECTS koordinatora fakulteta/odjela: ", 55, 485);
    upisiTextUCelijuBold(doc, "Potpis ECTS koordinatora institucije: ", 311, 485);
    celija(doc, 50, 500, 256, 20); celija(doc, 306, 500, 256, 20);
    upisiTextUCeliju(doc, "Datum: ", 55, 505);
    upisiTextUCeliju(doc, "Datum: ", 311, 505);

    celija(doc, 50, 530, 512, 15);
    doc.font('Times-Bold')
        .text('Izmjene u prvobitno predlozenom programu studija/ugovoru o ucenju', 75, 533, { align: 'center' })

    var y = 545;
    for (var i = 0; i < 4; i++) {
        celija(doc, 50, y, 256, 15); celija(doc, 306, y, 256, 15);
        if (i == 0) {
            i
            upisiTextUCeliju(doc, "Izostavljeni predmeti", 55, y + 3);
            upisiTextUCeliju(doc, "Dodani predmeti", 311, y + 3);
        }
        y += 15;
    }
    celija(doc, 50, 620, 256, 30); celija(doc, 306, 620, 256, 30);
    upisiTextUCelijuBold(doc, "Potpis studenta: ", 55, 630);
    upisiTextUCeliju(doc, "Datum: ", 311, 630);
    celija(doc, 50, 660, 512, 15);
    upisiTextUCelijuBold(doc, "Maticna institucija: potvrdjujemo da je predlozeni program studiranja/ugovor o ucenju prihvacen.", 55, 663);
    celija(doc, 50, 675, 256, 20); celija(doc, 306, 675, 256, 20);
    upisiTextUCelijuBold(doc, "Potpis ECTS koordinatora institucije: ", 55, 680);
    upisiTextUCelijuBold(doc, "Potpis dekana institucije: ", 311, 680);
    celija(doc, 50, 695, 256, 20); celija(doc, 306, 695, 256, 20);
    upisiTextUCeliju(doc, "Datum: ", 55, 700);
    upisiTextUCeliju(doc, "Datum: ", 311, 700);
    doc.end()

    const student_id = req.params.idStudent;

    db.Ugovori.findAll({
        where: {
            idStudent: student_id
        }
    }).then(student => {

        var data = fs.readFileSync('Routes/Ugovori/' + student_id + 'st.pdf');
        var pdf = data.toString('base64');

        var datum = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();

        if (!student[0]) {
            db.sequelize.query("INSERT INTO Ugovori (idStudent, ugovor, datumKreiranja) VALUES (" + student_id + ",'" + pdf + "','" + datum + "')").then(info => res.status(200).send({
                success: 'true',
                message: 'Ugovor added successfully'
            }))
        }
        else {
            db.sequelize.query("UPDATE Ugovori SET ugovor='" + pdf + "',datumKreiranja='" + datum + "'  WHERE idStudent=" + student_id).then(info => res.status(201).send({
                info: info,
                success: 'true',
                message: 'Ugovor updated successfully'
            }))

        }
    });


});

router.get('/url/:idStudent', (req, res) => {

    const student_id = req.params.idStudent;

    db.Ugovori.findAll({
        where: {
            idStudent: student_id
        }
    }).then(ugovor => {

        if (!ugovor[0]) {
            res.send({
                link: null
            })
        }
        else {
            var ug = ugovor[0].ugovor;
            var url = "data:application/pdf;base64," + ug;
            res.send(
                {
                    link: url
                })
        }
    })
});

module.exports = router;