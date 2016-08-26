/**
*
* Desarrollo para CLIMO que revisa el Inbox de gmail en busca de emails enviados
* desde el formulario de contacto, y según cierto criterio envía respuestas automáticas.
*
* @author seb
*/

  // ///// CONFIG ///////////////////

  var HoraInicio = 21;
  var HoraCierre = 22;

  // ////////////////////////////////

  var util = require('util');
  var POP3Client = require('poplib');
  var mailgun = require('mailgun-js')({apiKey: 'key-4f62ca6ebe491376f6411bf49cbff872', domain: 'climino.com'});
  var mailcomposer = require('mailcomposer');

  var host = 'pop.gmail.com';
  var port = 995;
  var debug = false;
  var enabletls = true;
  var username = 'sebastian.delvalle@engiefactory.com';
  var password = 'TestTest';

  var client = new POP3Client(port, host, {
    debug: debug,
    enabletls: enabletls
  });

  // MAILGUN
  var enviarAviso = function (email, tipo, persona) {
    GLOBAL.persona = persona;
    var mail = mailcomposer({
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
      console.log('enviando a ', GLOBAL.persona.email);
      mailgun.messages().sendMime(dataToSend, function (sendError, body) {
        if (sendError) {
          console.log(sendError);
          return;
        }
      });
    });
  };
  // ///////////////////////////////////////////

  client.on('error', function (err) {

    if (err.errno === 111) console.log('Unable to connect to server');
    else console.log('Server error occurred');

    console.log(err);

  });

  client.on('connect', function (rawdata) {

    console.log('CONNECT success');
    client.login(username, password);

  });

  client.on('invalid-state', function (cmd) {
    console.log('Invalid state. You tried calling ' + cmd);
  });

  client.on('locked', function (cmd) {
    console.log('Current command has not finished yet. You tried calling ' + cmd);
  });

  client.on('login', function (status, rawdata) {

    if (status) {

      console.log('LOGIN/PASS success');
      client.capa();

    } else {

      console.log('LOGIN/PASS failed');
      client.quit();

    }

  });

  client.on('capa', function (status, data, rawdata) {

    if (status) {

      console.log('CAPA success');
      if (debug) console.log('Parsed data: ' + util.inspect(data));
      client.noop();

    } else {

      console.log('CAPA failed');
      client.quit();

    }

  });

  client.on('noop', function (status, rawdata) {

    if (status) {

      console.log('NOOP success');
      client.stat();

    } else {

      console.log('NOOP failed');
      client.quit();

    }

  });


  client.on('stat', function (status, data, rawdata) {

    if (status === true) {

      console.log('STAT success');
      if (debug) console.log('Parsed data: ' + util.inspect(data));
      client.list();

    } else {

      console.log('STAT failed');
      client.quit();

    }
  });

  client.on('list', function (status, msgcount, msgnumber, data, rawdata) {

    if (status === false) {

      if (msgnumber !== undefined) console.log('LIST failed for msgnumber ' + msgnumber);
      else console.log('LIST failed');

      client.quit();

    } else if (msgcount === 0) {

      console.log('LIST success with 0 elements');
      client.quit();

    } else {
      GLOBAL.msgcount = msgcount;
      console.log('LIST success with ' + msgcount + ' element(s)');
      client.uidl();

    }
  });

  client.on('uidl', function (status, msgnumber, data, rawdata) {

    if (status === true) {

      console.log('UIDL success');
      if (debug) console.log('Parsed data: ' + data);
      client.top(GLOBAL.msgcount, 10);

    } else {

      console.log('UIDL failed for msgnumber ' + msgnumber);
      client.quit();

    }
  });


  client.on('top', function (status, msgnumber, data, rawdata) {

    if (status === true) {

      console.log('TOP success for msgnumber ' + msgnumber);
      if (debug) console.log('Parsed data: ' + data);
      client.retr(msgnumber);

    } else {

      console.log('TOP failed for msgnumber ' + msgnumber);
      client.quit();

    }
  });

  client.on('retr', function (status, msgnumber, data, rawdata) {

    if (status === true) {

      console.log('RETR success for msgnumber ' + msgnumber + '\n---------------------');


      // metadata
      var subj = data.match(/Subject: (.+)/);
      if (subj) subj = subj[1]; else return console.log('Omitiendo correo sin subject\n---------------------');
      console.log('tenemos fecha', date);
      var date = data.match(/Date: (.+)/);
      if (date) date = new Date(date[1]); else return console.log('Omitiendo correo sin fecha\n---------------------');
      console.log('Fecha:', date);

      // contenido
      var txt = data.split('Content-Type: text/plain; charset=UTF-8')[1];
      if (!txt) return console.log('Omitiendo email escrito en HTML\n--------------------\n');
      txt = txt.split('Content-Type: text/html; charset=UTF-8')[0];
      txt = txt.split('\n');
      txt.splice(0, 1);
      txt.splice(txt.length - 1, 1);
      txt = txt.join('\n');



      if (subj === 'Contacto por formulario') {
        console.log('Detectado formulario de contacto!');
        console.log('\n---------------------');
        try {
          var persona = {
            nombre: txt.match(/Nombre: - (.*)/)[1],
            email: txt.match(/Correo: - (.*)/)[1],
            telefono: txt.match(/Tel.+fono: - (.*)/)[1],
            tipo: txt.match(/Tipo de vivienda: - (.*)/)[1],
            zonas: txt.match(/zonas quieres climatizar. - (.*)/)[1]
          };

          console.log('* La persona se llama "%s" y su correo es "%s"', persona.nombre, persona.email);

          if (date.getHours() < HoraInicio) {
            console.log('* Enviando aviso de que abrimos a las %s', HoraInicio);
            enviarAviso(persona.email, 'inicio', persona);
          }
          if (date.getHours() > HoraCierre) {
            console.log('* Enviando aviso de que cerramos a las %s', HoraCierre);
            enviarAviso(persona.email, 'cierre', persona);
          }
        } catch (e) { console.log('Error procesando formulario!\n---------------------\n', e); }
      } else { console.log('Omitiendo correo "%s"\n---------------------\n', subj); }

      // console.log('Parsed data: ' + data)

      if (msgnumber !== undefined) { // client.dele(msgnumber)
        client.quit();
      }
    } else {
      console.log('RETR failed for msgnumber ' + msgnumber);
      client.quit();
    }
  });

  client.on('dele', function (status, msgnumber, data, rawdata) {
    if (status === true) {
      console.log('DELE success for msgnumber ' + msgnumber);
      client.rset();
    } else {
      console.log('DELE failed for msgnumber ' + msgnumber);
      client.quit();
    }
  });

  client.on('rset', function (status, rawdata) {
    if (status === true) console.log('RSET success');
    else console.log('RSET failed');
    client.quit();
  });

  client.on('quit', function (status, rawdata) {
    if (status === true) console.log('QUIT success');
    else console.log('QUIT failed');
  });
