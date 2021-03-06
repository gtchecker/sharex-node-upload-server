const config = require('./config.json');
const path= require('path')
const sh = require('shortid');
const fs = require('fs');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// default options
app.use(fileUpload());

app.post('/upload', function (req, res) {
    if(req.header("api_key")!==config.api_key){
        return res.sendStatus(403);
    }
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    let fileExtension  = getExtension(sampleFile.name)
    let filename = sh.generate()+"."+fileExtension;
    console.log(filename);
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(__dirname + '/uploads/' + filename, function (err) {
        if (err)
            return res.status(500).send(err);

        res.send(req.get('host')+"/"+filename);
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/:filename', function (req, res) {
    let path=__dirname+'/uploads/'+req.params.filename;
    fs.exists(path, function(exists) {
    if(exists){
        res.sendFile(__dirname+'/uploads/'+req.params.filename);
    }else{
        return res.sendStatus(404);
    }
    });
});
app.listen(config.port);
console.log("Server is running!")

function getExtension(filename) {
    var ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
}

