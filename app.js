/**
*
* Desarrollo para CLIMO que revisa el Inbox de gmail en busca de emails enviados
* desde el formulario de contacto, y según cierto criterio envía respuestas automáticas.
*
* @author seb
*/

const config  = require('./config');
const db      = require('./modulos/db');
const api     = require('./modulos/api');
const email   = require('./modulos/email');
const cron    = require('./modulos/cron');

email.check(); //chequeo inicial
