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
log('OK');

process.stdin.on('data', function(d) {
  let cmd=d.toString().trim();
  switch(cmd) {

    //nodemon
    case 'rs':
      break;

    //mostrar lista de condiciones y calces
    case 'c':
      log('Listando condiciones..');
      condi.check();
      break;

    //realizar comprobación de email
    case 'm':
    log('Forzando chequeo de email..')
      email.check();
      break;

    //realizar comprobación masiva para tratar de vaciar la cola (SE CAE)
    case 'mm':
    log('MEGA CHECK')
      for (let i=0; i<=230; i++) email.check();
      break;

    //información de ayuda
    default:
      log(`Comando desconocido: ${cmd.yellow}`);
      break;
  }
});
