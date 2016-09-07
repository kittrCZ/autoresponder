/**
 * Muestra un log en la consola especial para cada módulo
 * Le asigna un color diferente a cada módulo al momento de mostrarlo en la consola
 *
 * Se puede definir en la configuración si se quiere mostrar la hora
 *
 * @author seb
 */

'use strict';
const config = require('../config.js')
const colors = require('colors');
const cl = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'grey'];


module.exports = function(modulo) {
  return function (a,b,c,d) {

    //color - se le asigna uno a cada modulo recibido
    if (!GLOBAL.colorLog) GLOBAL.colorLog={i:0};
    if (!GLOBAL.colorLog[modulo]) GLOBAL.colorLog[modulo] = ++GLOBAL.colorLog.i>cl.length-1 ? GLOBAL.colorLog.i=0:GLOBAL.colorLog.i;
    var colorear = colors[cl[GLOBAL.colorLog[modulo]]];

    //usar hora en los logs?
    var hora = '';
    if (config.horaLog) {
      let d = new Date();
      hora = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()<10?'0'+d.getSeconds():d.getSeconds()} `;
    }

    //mostrar log en consola
    console.log('[%s%s]' , hora, colorear(modulo), a||'',b||'',c||'',d||'');
  }
}
