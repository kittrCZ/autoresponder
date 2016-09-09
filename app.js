/**
*
* Desarrollo para CLIMO que revisa el Inbox de gmail en busca de emails enviados
* desde el formulario de contacto, y según cierto criterio envía respuestas automáticas.
*
* @author seb
*/
'use strict';

const db      = require('./util/db');
const api     = require('./modulos/api');
const email   = require('./modulos/email');
const cron    = require('./modulos/cron');

// email.check(); //chequeo inicial

db.all('SELECT * from config where param="condiciones"', function (err, r) {
  var condiciones = JSON.parse(r[0].value);
  for (let i in condiciones) {
    let condicion = condiciones[i];
    console.log('cond:',condicion.tipo_condicion);
  }
})
