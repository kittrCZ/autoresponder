/**
 * Das cron
 * @author seb
 */

 const log = require('../util/log')('CRON');
 const cron = require('node-cron');
 const config = require('../config');
 const email = require('../email');

 log(`OK cada ${config.cronCadence} minutos`);

 cron.schedule('*/'+config.cronCadence+' * * * *', function () {
   log('Revisando email..');
   email.check();
 });

  module.exports = {

  }
