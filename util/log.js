module.exports = function(modulo) {
  return function (a,b,c,d) {
    console.log('[Modulo: %s] ', modulo, a||'',b||'',c||'',d||'');
  }
}
