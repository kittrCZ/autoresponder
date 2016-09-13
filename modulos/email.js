/**
 * Modulo de email
 * 
 * Se conecta a un servidor POP3 y procesa el último email almacenado allí, y luego
 * determina si alguna condición vigente calza con la hora actual, enviando un correo
 * de acuerdo al criterio conincidente.
 *
 * @author seb
 */

'use strict';
const db = require('../util/db');
const log = require('../util/log')('EMAIL');
const condi = require('./condi');
log(`OK`);

module.exports = {
  check: function() {
    log('...');
    const util = require('util');
    const POP3Client = require('poplib');
    const mailgun = require('mailgun-js')({apiKey: 'key-4f62ca6ebe491376f6411bf49cbff872', domain: 'climino.com'});
    const mailcomposer = require('mailcomposer');

    const host = 'pop.gmail.com';
    const port = 995;
    const debug = false;
    const enabletls = true;
    const username = 'sebastian.delvalle@engiefactory.com';
    const password = 'TestTest';

    const client = new POP3Client(port, host, {
      debug: debug,
      enabletls: enabletls
    });

    // MAILGUN
    const enviarAviso = (persona, mensaje) => {
      GLOBAL.persona = persona; //guardar para usar en callbacks
      mensaje = mensaje.replace(/\n/g, '<br>');
      var mail = mailcomposer({
        from: 'Climo <contacto@climo.com>',
        to: persona.email,
        subject: 'Gracias por contactarnos',
        html: mensaje.replace(/NOMBRE/g, `<b>${persona.nombre}</b>`)
      });

      mail.build(function (mailBuildError, message) {
        var dataToSend = {
          to: GLOBAL.persona.email,
          message: message.toString('ascii')
        };
        // log('enviando a', GLOBAL.persona.email);
        mailgun.messages().sendMime(dataToSend, function (sendError, body) {
          if (sendError) {
            log(sendError);
            return;
          }
        });
      });
    };
    // ///////////////////////////////////////////

    client.on('error', function (err) {
      if (err.errno === 111) log('Unable to connect to server');
      else log('Server error occurred');
      log(err);
    });

    client.on('connect', function (rawdata) {
      client.login(username, password);
    });

    client.on('invalid-state', function (cmd) {
      log('Invalid state. You tried calling ' + cmd);
    });

    client.on('locked', function (cmd) {
      log('Current command has not finished yet. You tried calling ' + cmd);
    });

    client.on("login", function(status, data) {
    	if (status) {
    		client.list();
    	} else {
    		log("LOGIN/PASS failed");
    		client.quit();
    	}
    });

    client.on("list", function(status, msgcount, msgnumber, data, rawdata) {
    	if (status === false) {
    		log("LIST failed");
    		client.quit();
    	} else if (msgcount > 0) {
    		let totalmsgcount = msgcount;
    		let currentmsg = 1;
    		log("LIST success with " + msgcount + " message(s)");
    		client.retr(1);
    	} else {
    		log("LIST success with 0 message(s)");
    		client.quit();
    	}
    });

    client.on('retr', function (status, msgnumber, data, rawdata) {
      if (status === true) {
        let omitir = false;

        //metadata
        var subj = data.match(/Subject: (.+)/);
        if (subj) subj = subj[1]; else { omitir=true; log('Omitiendo correo sin subject'.cyan); }
        var date = data.match(/\nDate: (.+)/);
        if (date) date = new Date(date[1]); { omitir=true; log('Omitiendo correo sin fecha'.cyan); }

        // contenido
        if (!data.match(/Content-Type:/)) {
          log(`Procesando email sin Content-Type: ${subj}`.cyan)
          txt = data;
        } else {
          var txt = data.split('Content-Type: text/plain; charset=UTF-8')[1];
          if (!txt) { omitir=true; log(`Omitiendo email escrito en HTML: ${subj}`.cyan); }
        }
        if (!omitir) {
          txt = txt.split('Content-Type: text/html; charset=UTF-8')[0];
          txt = txt.split('\n');
          txt.splice(0, 1);
          txt.splice(txt.length - 1, 1);
          txt = txt.join('\n');
        }


        if (subj === 'Contacto por formulario' && !omitir) {
          try {
            var persona = {
              nombre: txt.match(/Nombre: - (.*)/)[1],
              email: txt.match(/Correo: - (.*)/)[1],
              telefono: txt.match(/Tel.+fono: - (.*)/)[1],
              tipo: txt.match(/Tipo de vivienda: - (.*)/)[1],
              zonas: txt.match(/zonas quieres climatizar. - (.*)/)[1]
            };

            //detectado formulario contacto
            log(`Contacto de "${persona.nombre}" (${persona.email}), buscando condición..`.yellow);

            condi.check((tipo, criterio) => {
              log(`"${criterio.mensaje}"`.green);
              // enviarAviso(persona, criterio.mensaje);
            });

          } catch (e) { log('Error procesando formulario!', e); }
        } else { log(`Omitiendo contacto mal formado "${subj}"`.cyan); }

        // log('Parsed data: ' + data)

        if (msgnumber !== undefined) { // client.dele(msgnumber)
          // client.quit(); //esto estaba bien, pero por pruebas de ver todo lo comento
        }
      } else {
        log('RETR failed for msgnumber ' + msgnumber);
        client.quit();
      }
    });

    client.on('dele', function (status, msgnumber, data, rawdata) {
      if (status === true) {
        log('DELE success for msgnumber ' + msgnumber);
        client.rset();
      } else {
        log('DELE failed for msgnumber ' + msgnumber);
        client.quit();
      }
    });

    client.on('rset', function (status, rawdata) {
      client.quit();
    });

    client.on('quit', function (status, rawdata) {
      if (status !== true)  log('QUIT failed');
    });
  }
}
