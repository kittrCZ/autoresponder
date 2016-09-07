/**
*
* Desarrollo para CLIMO que revisa el Inbox de gmail en busca de emails enviados
* desde el formulario de contacto, y según cierto criterio envía respuestas automáticas.
*
* @author seb
*/

const db      = require('./modulos/db');
const config  = require('./config');
const api     = require('./modulos/api')(config, db);
const email   = require('./modulos/email')(config, db);
const cron    = require('./modulos/cron')(config, email);
