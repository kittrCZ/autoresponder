/**
 * Operador de la base de datos
 *
 */

'use strict';
const log = require('../util/log')('DB');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('datos/db.sqlite');



// for (var i=0;i<99999*20000;i++) {}

db.run("CREATE TABLE IF NOT EXISTS config (param TEXT, value TEXT)", function (err) {
  if(err) return log(`${'ERROR'.red.bold} ${err}`);
  else log('OK');
});


module.exports = {

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
