/**
 * Modulo de email
 *
 * @author seb
 */

const log = require('../util/log')('EMAIL');

module.exports = function (config) {
  log(`OK de ${config.HoraInicio} a ${config.HoraCierre} horas`);
  return {
    check: function() {
      log('** Iniciando chequeo de email **');
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
      const enviarAviso = function (email, tipo, persona) {
        GLOBAL.persona = persona;
        const mail = mailcomposer({
          from: 'Climo <contacto@climo.com>',
          to: GLOBAL.persona.email,
          subject: 'Gracias por contactarnos',
          html: 'Estimado <b>' + persona.nombre + '</b>:<br><br>Nuestro horario de atención es de ' + HoraInicio + ' a ' + HoraCierre + ' hrs. Le respondremos su correo tan pronto estemos atendiendo.<br><br>Saludos'
        });

        mail.build(function (mailBuildError, message) {
          var dataToSend = {
            to: GLOBAL.persona.email,
            message: message.toString('ascii')
          };
          log('enviando a ', GLOBAL.persona.email);
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

        // log('Conectado');
        client.login(username, password);

      });

      client.on('invalid-state', function (cmd) {
        log('Invalid state. You tried calling ' + cmd);
      });

      client.on('locked', function (cmd) {
        log('Current command has not finished yet. You tried calling ' + cmd);
      });

      client.on('login', function (status, rawdata) {

        if (status) {

          // log('LOGIN/PASS success');
          client.capa();

        } else {

          log('LOGIN/PASS failed');
          client.quit();

        }

      });

      client.on('capa', function (status, data, rawdata) {

        if (status) {

          // log('CAPA success');
          if (debug) log('Parsed data: ' + util.inspect(data));
          client.noop();

        } else {

          log('CAPA failed');
          client.quit();

        }

      });

      client.on('noop', function (status, rawdata) {

        if (status) {

          // log('NOOP success');
          client.stat();

        } else {

          log('NOOP failed');
          client.quit();

        }

      });


      client.on('stat', function (status, data, rawdata) {

        if (status === true) {

          // log('STAT success');
          if (debug) log('Parsed data: ' + util.inspect(data));
          client.list();

        } else {

          log('STAT failed');
          client.quit();

        }
      });

      client.on('list', function (status, msgcount, msgnumber, data, rawdata) {

        if (status === false) {

          if (msgnumber !== undefined) log('LIST failed for msgnumber ' + msgnumber);
          else log('LIST failed');

          client.quit();

        } else if (msgcount === 0) {

          // log('LIST success with 0 elements');
          client.quit();

        } else {
          GLOBAL.msgcount = msgcount;
          // log('LIST success with ' + msgcount + ' element(s)');
          client.uidl();

        }
      });

      client.on('uidl', function (status, msgnumber, data, rawdata) {

        if (status === true) {

          // log('UIDL success');
          if (debug) log('Parsed data: ' + data);
          client.top(GLOBAL.msgcount, 10);

        } else {

          log('UIDL failed for msgnumber ' + msgnumber);
          client.quit();

        }
      });


      client.on('top', function (status, msgnumber, data, rawdata) {

        if (status === true) {

          // log('TOP success for msgnumber ' + msgnumber);
          if (debug) log('Parsed data: ' + data);
          client.retr(msgnumber);

        } else {

          log('TOP failed for msgnumber ' + msgnumber);
          client.quit();

        }
      });

      client.on('retr', function (status, msgnumber, data, rawdata) {

        if (status === true) {

          // log('RETR success for msgnumber ' + msgnumber + '\n---------------------');


          // metadata
          var subj = data.match(/Subject: (.+)/);
          if (subj) subj = subj[1]; else return log('Omitiendo correo sin subject');
          var date = data.match(/\nDate: (.+)/);
          if (date) date = new Date(date[1]); else return log('Omitiendo correo sin fecha');
          log('Fecha:', date);

          // contenido
          var txt = data.split('Content-Type: text/plain; charset=UTF-8')[1];
          if (!txt) return log('Omitiendo email escrito en HTML');
          txt = txt.split('Content-Type: text/html; charset=UTF-8')[0];
          txt = txt.split('\n');
          txt.splice(0, 1);
          txt.splice(txt.length - 1, 1);
          txt = txt.join('\n');



          if (subj === 'Contacto por formulario') {
            log('Detectado formulario de contacto!');
            try {
              var persona = {
                nombre: txt.match(/Nombre: - (.*)/)[1],
                email: txt.match(/Correo: - (.*)/)[1],
                telefono: txt.match(/Tel.+fono: - (.*)/)[1],
                tipo: txt.match(/Tipo de vivienda: - (.*)/)[1],
                zonas: txt.match(/zonas quieres climatizar. - (.*)/)[1]
              };

              log('* La persona se llama "%s" y su correo es "%s"', persona.nombre, persona.email);

              if (date.getHours() < HoraInicio) {
                log('* Enviando aviso de que abrimos a las %s', HoraInicio);
                enviarAviso(persona.email, 'inicio', persona);
              }
              if (date.getHours() > HoraCierre) {
                log('* Enviando aviso de que cerramos a las %s', HoraCierre);
                enviarAviso(persona.email, 'cierre', persona);
              }
            } catch (e) { log('Error procesando formulario!', e); }
          } else { log(`Omitiendo correo "${subj}"`); }

          // log('Parsed data: ' + data)

          if (msgnumber !== undefined) { // client.dele(msgnumber)
            client.quit();
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
        // if (status === true) log('RSET success');
        if (status !== true) log('RSET failed');
        client.quit();
      });

      client.on('quit', function (status, rawdata) {
        // if (status === true) log('QUIT success');
        if (status !== true)  log('QUIT failed');
      });
    }

  }
}
