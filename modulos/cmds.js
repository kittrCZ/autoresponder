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

    case 'm':
    log('Forzando chequeo de email..')
      email.check();
      break;

      case 'mm':
      log('MEGA CHECK')
        for (let i=0; i<=230; i++) email.check();
        break;

    default: break;
  }
});
