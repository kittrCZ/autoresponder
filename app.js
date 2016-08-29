/**
*
* Desarrollo para CLIMO que revisa el Inbox de gmail en busca de emails enviados
* desde el formulario de contacto, y según cierto criterio envía respuestas automáticas.
*
* @author seb
*/


const config  = require('./config')
const db      = require('./modulos/db')(config);
const api     = require('./modulos/api')(config);
const mail    = require('./modulos/mail')(config);
