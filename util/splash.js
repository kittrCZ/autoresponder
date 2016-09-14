require('colors');

var splash ='\n';
splash+='                                   \n'.bgBlue;
splash+='       Climo Auto Responder        \n'.bgBlue.white;
splash+='                                   \n'.bgBlue;
console.log(splash);

process.on('SIGINT',()=>{
  console.log('\n    Adiós :)    \n'.bgRed.white);
  process.exit();
})

// process.on('SIGUSR2',()=>{
//   console.log('  Reiniciando via Nodemon  \n'.bgRed.white);
//   process.exit();
// })
