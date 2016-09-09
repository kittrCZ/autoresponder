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






process.stdin.on('data', function(d) {
  let cmd=d.toString().trim();
  if (cmd != 'rs')  email.check();
});


const dia = function (dia) {
  return dia;
}
const fecha = function (fecha) {
  return fecha;
}
const hora = function (hora) {
  return hora;
}

db.all('SELECT * from config where param="condiciones"', function (err, r) {
  var condiciones = JSON.parse(r[0].value);
  for (let i in condiciones) {
    let condicion = condiciones[i];

    if (condicion.tipo_condicion == 'rango_dias') {
      console.log(`* Desde el ${fecha(condicion.fechaDesde)} hasta el ${fecha(condicion.fechaHasta)}`);

    }
    if (condicion.tipo_condicion == 'dia_semana') {
      console.log(`* Todos los ${dia(condicion.dia_semana)}`);
    }
    if (condicion.tipo_condicion == 'fecha') {
      console.log(`* El día ${fecha(condicion.fecha)}`);
    }
    if (condicion.tipo_condicion == 'rango_horas') {
      console.log(`* Entre las ${hora(condicion.horaDesde)} y las ${hora(condicion.horaHasta)}`);
    }
    if (condicion.tipo_condicion == 'hora') {
      console.log(`* Todos los días a las ${hora(condicion.hora)}`);
    }
  }
})
