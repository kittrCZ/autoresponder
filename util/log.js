/**
 * Configuración del sistema
 *
 * @author seb
 */

'use strict';
const config = require('../config.js')

module.exports = function(modulo) {
  return function (a,b,c,d) {

    //usar hora en los logs?
    var hora = '';
    if (config.horaLog) {
      let d = new Date();
      hora = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()<10?'0'+d.getSeconds():d.getSeconds()} `;
    }

    //mostrar log en consola
    console.log('[%s%s] ', hora, modulo, a||'',b||'',c||'',d||'');
  }
}
