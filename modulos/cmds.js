/**
 * Procesa comandos ingresados en el terminal
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

    case 'rs':
      break;

    case 'c':
      log('Listando condiciones..');
      condi.check();
      break;

    default:
    log('Forzando chequeo de email..')
      email.check();

  }
});
