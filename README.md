# Autoresponder

Este proyecto revisa un Inbox de gmail en busca de emails enviados desde un formulario de contacto y, según criterios configurables, envía respuestas automáticas.

Para configurar los criterios o condiciones se debe utilizar la API, pero existe una interfaz gráfica hecha a modo de plugin de Wordpress, llamada [autoresponder-wp](https://github.com/sebfindling/autoresponder-wp).

El sistema está dividido en módulos que se pueden activar o desactivar a gusto.


## Instrucciones:
Se debe almacenar el usuario y contraseña de gmail como variales de entorno, de esta manera:
```bash
export AutoresponderUSER="usuario@gmail.com"
export AutoresponderPASS="password"
```
Luego, instalar dependencias e iniciar el programa:
```bash
npm install
node .
```
