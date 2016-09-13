/**
 * CLIMO Auto Responder
 *
 * Desarrollo para CLIMO que revisa el Inbox de gmail en busca de emails enviados
 * desde el formulario de contacto, y según cierto criterio envía respuestas automáticas.
 *
 * El sistema está dividido en módulos que se pueden activar o desactivar a gusto.
 *
 * @author seb
 */


'use strict';
const api     = require('./modulos/api');
const email   = require('./modulos/email');
const condi   = require('./modulos/condi');
const cmds    = require('./modulos/cmds');
// const cron    = require('./modulos/cron');
