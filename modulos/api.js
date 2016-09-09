/**
 * La API
 *
 * @author seb
 */
'use strict';

const log = require('../util/log')('API');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('../config');

app.use(bodyParser.json());

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//BASE
app.get('/', function (req, res) {
  res.send('API OK');
});

//ACCIONES
app.get('/config', function (req,res) {
  db.all(`select * from config`, function (err, params) {
    log('Respondiendo config');
    var conf={};
    for (let i in params) conf[params[i].param] = params[i].value;
    res.json(conf);
  })
})

app.post('/config', function (req,res) {
  var query='';
  var params=req.body;

  //guardar parametros en la config (pisar si ya existen)
  db.serialize(function () {
    for (let param in params) {
      log(`Seteando "${param}" a "${params[param]}"`);
      db.run(`delete from config where param='${param}'`);
      db.run(`INSERT INTO config values ('${param}', '${params[param]}')`);
    }
    res.json({status:'ok'});
  })

})



app.listen(config.puertoAPI, function () {
  log(`OK en ${config.hostAPI}:${config.puertoAPI}`);
});
