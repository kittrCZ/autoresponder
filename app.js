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





//procesar comandos escritos en el terminal
process.stdin.on('data', function(d) {
  let cmd=d.toString().trim();
  if (cmd != 'rs')  email.check(); //exceptuar 'rs' usado por nodemon
});


const dias = ['','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const dia = (d) => dias[d];
const hoy = new Date(); hoy.setHours(0,0,0,0);
const hora = (h) => new Date(h).getHours()+':'+(new Date(h).getMinutes()>9?new Date(h).getMinutes():'0'+new Date(h).getMinutes());

//buscar las condiciones en la base de datos
db.all('SELECT * from config where param="condiciones"', function (err, r) {
  var condiciones = JSON.parse(r[0].value);
  var criterios = {rango_dias:[], dia_semana:[], fecha:[], rango_horas:[], hora:[]};
  for (let i in condiciones) {
    let condicion = condiciones[i];

    //cachear las condiciones en arreglos de criterios
    if (condicion.tipo_condicion == 'rango_dias') {
      console.log(`[Condición] Desde el ${condicion.fechaDesde} hasta el ${condicion.fechaHasta}`);
      criterios['rango_dias'].push(condicion);
    }
    if (condicion.tipo_condicion == 'dia_semana') {
      console.log(`[Condición] Todos los ${dia(condicion.dia_semana)}`);
      criterios['dia_semana'].push(condicion);
    }
    if (condicion.tipo_condicion == 'fecha') {
      console.log(`[Condición] El día ${condicion.fecha}`);
      criterios['fecha'].push(condicion);
    }
    if (condicion.tipo_condicion == 'rango_horas') {
      console.log(`[Condición] Entre las ${hora(condicion.horaDesde)} y las ${hora(condicion.horaHasta)}`);
      criterios['rango_horas'].push(condicion);
    }
    if (condicion.tipo_condicion == 'hora') {
      console.log(`[Condición] Todos los días a las ${hora(condicion.hora)}`);
      criterios['hora'].push(condicion);
    }
  }

  //verificar si algún criterio coincide
  var calce = false;
  if (criterios['rango_dias'].length>0) {
    for (let i in criterios['rango_dias']) {
      let criterio = criterios['rango_dias'][i];
      let fechaDesde = new Date(criterio.fechaDesde); fechaDesde.setHours(0,0,0,0);
      let fechaHasta = new Date(criterio.fechaHasta); fechaHasta.setHours(23,59,59,59);

      if (hoy >= fechaDesde && hoy <= fechaHasta) {
        calce = true;
        console.log('Calza criterio: rango de días'.green);
      }
    }
  }

  if (!calce && criterios['dia_semana'].length>0) {
    for (let i in criterios['dia_semana']) {
      let criterio = criterios['dia_semana'][i];
      if (hoy.getDay() == criterio.dia_semana) {
        calce = true;
        console.log('Calza criterio: día'.green);
      }
    }
  }

  if (!calce && criterios['fecha'].length>0) {
    for (let i in criterios['fecha']) {
      let criterio = criterios['fecha'][i];
      let fecha = new Date(criterio.fecha); fecha.setHours(0,0,0,0);
      if (hoy.toString() == fecha.toString()) {
        console.log('Calza criterio: fecha'.green);
      }
    }
  }
  if (!calce && criterios['rango_horas'].length>0) {
    for (let i in criterios['rango_horas']) {
      let criterio = criterios['rango_horas'][i];
      let horaActual = new Date().getHours();
      let horaDesde = new Date(criterio.horaDesde).getHours();
      let horaHasta = new Date(criterio.horaHasta).getHours();
      if (horaActual >= horaDesde && horaActual <= horaHasta) {
        console.log('Calza criterio: rango horas'.green);
      }
    }
  }
  if (!calce && criterios['hora'].length>0) {
    for (let i in criterios['hora']) {
      let criterio = criterios['hora'][i];
      let horaActual = new Date().getHours();
      let horaCriterio = new Date(criterio.hora).getHours();
      if (horaActual == horaCriterio) {
        console.log('Calza criterio: hora'.green);
      }
    }
  }

})
