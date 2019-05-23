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

router.get('/kreiraj/:idStudent', (req, res) => {

});

module.exports = router;