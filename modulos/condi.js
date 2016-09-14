/**
 * Modulo que detecta y ejecuta condiciones
 *
 * Ejemplo de Uso:
 *  let condi = require('./condi');
 *  condi.check((condi, data)=>{ console.log(`la condición que calza es '${condi}':`, data)})
 *
 *
 * @author seb
 */


'use strict';
const dias = ['','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const dia = (d) => dias[d];
const db = require('../util/db');
const log = require('../util/log')('CONDI');


//INIT
db.all('SELECT * from config where param="condiciones"', function (err, r) {
  var condiciones = JSON.parse(r[0].value);
  log(`OK (${condiciones.length} condiciones)`)
});

module.exports = {
  check: function (cb, debug) {
    if(!cb) cb = ()=>0;
    let ts = new Date(); ts.setHours(0,0,0,0);
    let hora = (h) => ('0'+new Date(h).getHours()).slice(-2)+':'+('0'+new Date(h).getMinutes()).slice(-2);

    //buscar las condiciones en la base de datos
    db.all('SELECT * from config where param="condiciones"', function (err, r) {
      if (err) return log(`Error: ${err}`);

      var condiciones = JSON.parse(r[0].value);
      var criterios = {rango_dias:[], dia_semana:[], fecha:[], rango_horas:[], hora:[]};
      for (let i in condiciones) {
        let condicion = condiciones[i];

        //cachear las condiciones en arreglos de criterios
        if (condicion.tipo_condicion == 'rango_dias') {
          if(debug) log(`- Desde el ${condicion.fechaDesde} hasta el ${condicion.fechaHasta}`);
          criterios['rango_dias'].push(condicion);
        }
        if (condicion.tipo_condicion == 'dia_semana') {
          if(debug) log(`- Todos los ${dia(condicion.dia_semana)}`);
          criterios['dia_semana'].push(condicion);
        }
        if (condicion.tipo_condicion == 'fecha') {
          if(debug) log(`- El día ${condicion.fecha}`);
          criterios['fecha'].push(condicion);
        }
        if (condicion.tipo_condicion == 'rango_horas') {
          if(debug) log(`- Entre las ${hora(condicion.horaDesde)} y las ${hora(condicion.horaHasta)}`);
          criterios['rango_horas'].push(condicion);
        }
        if (condicion.tipo_condicion == 'hora') {
          if(debug) log(`- Todos los días a las ${hora(condicion.hora)}`);
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

          if (ts >= fechaDesde && ts <= fechaHasta) {
            calce = true;
            if(debug) log('Calza criterio: rango de días'.green);
            cb('rango_dias', criterio);
          }
        }
      }

      if (!calce && criterios['dia_semana'].length>0) {
        for (let i in criterios['dia_semana']) {
          let criterio = criterios['dia_semana'][i];
          if (ts.getDay() == criterio.dia_semana) {
            calce = true;
            if(debug) log('Calza criterio: día'.green);
            cb('dia_semana', criterio);
          }
        }
      }

      if (!calce && criterios['fecha'].length>0) {
        for (let i in criterios['fecha']) {
          let criterio = criterios['fecha'][i];
          let fecha = new Date(criterio.fecha); fecha.setHours(0,0,0,0);
          if (ts.toString() == fecha.toString()) {
            if(debug) log('Calza criterio: fecha'.green);
            cb('fecha', criterio);
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
            if(debug) log('Calza criterio: rango horas'.green);
            cb('rango_horas', criterio);
          }
        }
      }
      if (!calce && criterios['hora'].length>0) {
        for (let i in criterios['hora']) {
          let criterio = criterios['hora'][i];
          let horaActual = new Date().getHours();
          let horaCriterio = new Date(criterio.hora).getHours();
          if (horaActual == horaCriterio) {
            if(debug) log('Calza criterio: hora'.green);
            cb('hora', criterio);
          }
        }
      }

    })

  }//probar
}//module
