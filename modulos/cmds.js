/**
 * Módulo de comandos de consola
 *
 * Permite recibir comandos en la ventana del terminal, para realizar diversas
 * operaciones de administración y testeo del sistema; además está pensada para funcionar
 * con `nodemon` aceptando el uso del comando `rs`.
 *
 * @author seb
 */


'use strict';
const email = require('./email');
const condi = require('./condi');
const log = require('../util/log')('CMD  ');


//LISTA DE COMANDOS
const comandos = {
  'rs': ()=> 0,
  'c':  ()=> {
    log('Listando condiciones..');
    condi.check();
  },
  'm':  ()=> {
    log('Forzando chequeo de email..')
    email.check();
  },
  'mm': ()=> {
    log('MEGA CHECK')
    for (let i=0; i<=230; i++) email.check();
  }
}




process.stdin.on('data', function(d) {
  let cmd=d.toString().trim();
  if (cmd) try{comandos[cmd]()} catch(e){ log(`Comando desconocido: ${cmd.yellow}`); }
});


log(`OK (${Object.keys(comandos).length} comandos)`);
