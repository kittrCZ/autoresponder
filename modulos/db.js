/**
 * Operador de la base de datos
 *
 */

const log = require('../util/log')('DB');

function putDb() {
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('datos/db.sqlite');

  db.serialize(function() {
   db.run("CREATE TABLE lorem (info TEXT)");

   var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
   for (var i = 0; i < 10; i++) {
       stmt.run("Ipsum " + i);
   }
   stmt.finalize();

   db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
       log(row.id + ": " + row.info);
   });
  });

  db.close();
}


module.exports = function (config) {
  log('OK')
}
