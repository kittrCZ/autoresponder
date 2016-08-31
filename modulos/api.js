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


module.exports = function (config, db) {

  app.use(bodyParser.json());

  //BASE
  app.get('/', function (req, res) {
    res.send('API OK');
  });

  //ACCIONES
  app.all('/:action', function (req,res) {
    let action = db[`${req.method}_${req.params.action}`];
    if (!action) return res.status(400).send('Accion o metodo invalido.');
    log(`Ejecutando ${req.method} ${req.params.action}`);
    action(res, req.body.params);
  })



  app.listen(3000, function () {
    log(`OK en ${config.hostAPI}:${config.puertoAPI}`);
  });

}
