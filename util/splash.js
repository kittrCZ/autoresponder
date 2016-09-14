require('colors');
var splash ='\n';
splash+='                                   \n'.bgBlue;
splash+='       Climo Auto Responder        \n'.bgBlue.white;
splash+='                                   \n'.bgBlue;
console.log(splash);


var sigint = '\n';
sigint+='                \n'.bgRed;
sigint+='    Adiós :)    \n'.bgRed.white;
sigint+='                \n'.bgRed;

process.on('SIGINT',()=>{
  console.log(sigint);
  process.exit();
})
