/**
*
* Desarrollo para CLIMO que revisa el Inbox de gmail en busca de emails enviados
* desde el formulario de contacto, y según cierto criterio envía respuestas automáticas.
*
* @author seb
*/
'use strict';

const db      = require('./util/db');
const api     = require('./modulos/api');
const email   = require('./modulos/email');
const cron    = require('./modulos/cron');
const condi   = require('./modulos/condi');
const cmds    = require('./modulos/cmds');
