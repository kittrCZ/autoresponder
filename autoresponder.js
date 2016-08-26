/**
 *
 * Desarrollo para CLIMO que revisa el Inbox de gmail en busca de emails enviados
 * desde el formulario de contacto, y según cierto criterio envía respuestas automáticas.
 *
 * @author seb
 */



 var Imap = require('imap'),
    inspect = require('util').inspect;

var imap = new Imap({
  user: 'sebastian.delvalle@engiefactory.com',
  password: 'TestTest',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    var f = imap.seq.fetch((box.messages.total) + '', { bodies: ['HEADER.FIELDS (FROM SUBJECT)','TEXT'] });
    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        if (info.which === 'TEXT')
          console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
        var buffer = '', count = 0;
        stream.on('data', function(chunk) {
          count += chunk.length;
          buffer += chunk.toString('utf8');
          if (info.which === 'TEXT')
            console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
            if (count==info.size && !GLOBAL.enviado) {
              GLOBAL.enviado=true;
              console.log('CUERPO', buffer)
              var cuerpoReal='', cuerpo = buffer.split('\n\n');
              console.log('TENIMO', cuerpo)
              for(var i in cuerpo) { if (i!=0 && i<=cuerpo.length-1) cuerpoReal+=cuerpo[i]+'\n'; }
              console.log('CUERPO REAL: ', cuerpoReal)

            }


        });
        stream.once('end', function() {
          if (info.which !== 'TEXT')
            console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
          else
            console.log(prefix + 'Body [%s] Finished', inspect(info.which));
        });
      });
      msg.once('attributes', function(attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        console.log(prefix + 'Finished');
      });
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      imap.end();
    });
  });
});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection ended');
});

imap.connect();
