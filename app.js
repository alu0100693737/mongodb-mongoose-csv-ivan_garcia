"use strict";

const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/basededatos');

app.set('port', (process.env.PORT || 5000));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));

const calculate = require('./models/calculate');

app.get('/', (request, response) => {
  response.render('index', { title: 'Comma Separated Value Analyzer' });
});

app.get('/csv', (request, response) => {
  response.send({ "rows": calculate(request.query.input) });
});

const Entrada = require('./models/db');

//Guardar maximo 4 entradas. Siempre se cambia la ultima
app.get('/mongo/', function(req, res) {
    Entrada.find({}, function(err, docs) {
        if (err)
            return err;
        if (docs.length >= 4) {
            Entrada.find({ name: docs[3].name }).remove().exec();
        }
    });
    let input = new Entrada({
        "name": req.query.name,
        "content": req.query.content
    });

    input.save(function(err) {
        if (err) {
            console.log(`Hubieron errores:\n${err}`);
            return err;
        }
        console.log(`Guardado: ${input}`);
    });
});

app.get('/find', function(req, res) {
    Entrada.find({}, function(err, docs) {
        if (err)
            return err;
        res.send(docs);
    });
});

//se devuelve el contenido
app.get('/findPorNombre', function(req, res) {
    Entrada.find({
        name: req.query.name
    }, function(err, docs) {
        res.send(docs);
    });
});
/*// Routes
app.get('/', producto.index)
 
app.get('/producto/:id', producto.show_edit)
 
app.post('/producto/:id', producto.update)
 
app.get('/delete-producto/:id', producto.remove)
 
app.get('/nuevo-producto', producto.create)*/


app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
