/**
 * La API
 *
 * @author seb
 */

const log = require('../util/log')('API');
const express = require('express');
const app = express();


function init() {
  app.get('/', function (req, res) {
    res.send('Hello World!');
  });

  app.listen(3000, function () {
    log('Example app listening on port 3000!');
  });
}


module.exports = function (config) {
  log('OK')
}
