/**
 * Módulo de CRON
 *
 * Ejecuta el chequeo de email cada cierto tiempo especificado en `config.js`
 *
 * @author seb
 */

'use strict';
 const log = require('../util/log')('CRON ');
 const cron = require('node-cron');
 const config = require('../config');
 const email = require('./email');

 log(`OK`);

 cron.schedule('*/'+config.cadenciaCron+' * * * *', function () {
   log('Revisando email..');
   email.check();
 });
