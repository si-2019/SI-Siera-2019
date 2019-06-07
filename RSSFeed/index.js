const express = require('express')
const rss = require('rss')
const app = express()

app.use(express.static('public'));




app.get('/rss', (req, res) => {


    var imeStudenta = "Neko Nekic";
    var RSS = require('rss');
 
    //Kreiranje feeda
    var feed = new RSS({
        title: 'Faklutetski RSS',
        description: 'Aktuelne informacije za studenta ' + imeStudenta,
        feed_url: 'http://localhost:8080/rss',
        language: 'bs-ba',
        
    });
     
    //Dodavanje obavijesti
    feed.item({
        title:  'Ime predmeta 1',
        description: 'Obacvijest 1',
        url : 'http://www.google.com'
    });
     
    feed.item({
        title:  'Ime predmeta 2',
        description: 'Obacvijest 2',
        url : 'http://www.google.com'
    });

    feed.item({
        title:  'Ime predmeta 3',
        description: 'Obacvijest 2',
        url : 'http://www.google.com'
    });

    var xml = feed.xml();
    res.writeHead(200,{'Content-Type':'application/xml'})
    res.end(xml);
    

})



app.listen(8080);