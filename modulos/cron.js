/**
 * Das cron
 * @author seb
 */

 const log = require('../util/log')('CRON');
 const cron = require('node-cron');

  module.exports = function (config, email) {
    log(`OK cada ${config.cronCadence} minutos`);

    //crear cron cada 5 minutos
    cron.schedule('*/'+config.cronCadence+' * * * *', function () {
      log('Revisando email..');
      email.check();
    });

    //inicializar
    // email.check();
  }
