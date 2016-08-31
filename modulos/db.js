/**
 * Operador de la base de datos
 *
 */

'use strict';
const log = require('../util/log')('DB');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('datos/db.sqlite');



module.exports = function (config) {
  db.run("CREATE TABLE IF NOT EXISTS config (param TEXT, value TEXT)", function (err) {
    if(err) return log(`ERR ${err}`);
    else log('OK');
  });
  return {

    /**
     * Guarda los ajustes enviados en un JSON
     */
    POST_setConfig: function (res, params) {
        var query='';
        for (let param in params) {
          log(`Seteando "${param}" a "${params[param]}"`);
          query+=`delete from config where param='${param}'; INSERT INTO config values ('${param}', '${params[param]}');`
        }
        log('query', query)
        db.run(query, function (err) {
          if (err) res.json({status:'error', msg:err});
          else res.json({status:'ok'});
        });

    },

    /**
     * Entrega la configuración
     */
    GET_getConfig: function (res) {
      db.all(`select * from config`, function (err, params) {
        log('Respondiendo config');
        res.json(params)
      })
    }



  }
}
