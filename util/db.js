/**
 * Operador de la base de datos
 *
 */

'use strict';
const log = require('../util/log')('DB   ');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');

db.run("CREATE TABLE IF NOT EXISTS config (param TEXT, value TEXT)", function (err) {
  if(err) return log(`${'ERROR'.red.bold} ${err}`);
  else log(`OK (${require('fs').statSync("db.sqlite").size}kb)`);
});


module.exports = db;
