/**
 * Operador de la base de datos
 *
 */

'use strict';
const log = require('../util/log')('DB');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('datos/db.sqlite');

log('OK');


// for (var i=0;i<99999*20000;i++) {}

db.run("CREATE TABLE IF NOT EXISTS config (param TEXT, value TEXT)", function (err) {
  if(err) return log(`${'ERROR'.red.bold} ${err}`);
  else log('OK');
});


module.exports = db;
