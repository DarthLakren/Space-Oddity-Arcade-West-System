# Pruebas de resiliencia y disponibilidad

## 1. Objetivo

Evaluar la disponibilidad de los recursos estáticos de Space Oddity Arcade West System y documentar el comportamiento esperado ante errores de acceso y fallos de almacenamiento local.

## 2. Entorno de pruebas

- Servicio AWS: Amazon S3.
- Región: us-east-2.
- Plataforma de pruebas: AWS CloudShell.
- Servidor local: Python HTTP Server.
- Herramientas: curl, Node.js y AWS CLI.

## 3. Resultados de las pruebas locales

Se utilizó un servidor HTTP local para comprobar que los archivos del proyecto estuvieran disponibles.

| Recurso | Resultado |
|---|---|
| index.html | HTTP 200 |
| css/style.css | HTTP 200 |
| js/game.js | HTTP 200 |
| js/player.js | HTTP 200 |
| js/enemies.js | HTTP 200 |
| js/storage.js | HTTP 200 |

También se ejecutó Node.js con `--check` sobre los cuatro archivos JavaScript. Los comandos finalizaron sin errores de sintaxis.

Durante la comprobación se solicitó inicialmente `storage.jsx`, que devolvió HTTP 404. Se identificó que la extensión correcta del archivo es `.js` y se comprobó posteriormente con éxito.

## 4. Resultados de las pruebas en Amazon S3

Se realizaron solicitudes HTTP al sitio publicado:

| Escenario | Resultado | Interpretación |
|---|---|---|
| Página principal | HTTP 200 | El sitio está disponible. |
| Recurso inexistente | HTTP 404 | S3 identifica correctamente el recurso inexistente. |
| index.html | HTTP 200 | Archivo disponible. |
| css/style.css | HTTP 200 | Hoja de estilos disponible. |
| js/game.js | HTTP 200 | Lógica principal disponible. |
| js/player.js | HTTP 200 | Módulo del jugador disponible. |
| js/enemies.js | HTTP 200 | Módulo de enemigos disponible. |
| js/storage.js | HTTP 200 | Módulo de almacenamiento disponible. |

Las pruebas confirmaron que los seis archivos principales del juego se pueden descargar desde el sitio publicado.

## 5. Escenarios adicionales y limitaciones

| Escenario | Comportamiento esperado | Estado |
|---|---|---|
| localStorage bloqueado | El juego continúa y el guardado del récord falla de forma controlada. | Pendiente de prueba manual |
| Recarga del navegador | El récord local permanece en el mismo navegador. | Pendiente de prueba manual |
| Pérdida de Internet | Los recursos no almacenados en caché dejan de descargarse. | Limitación documentada |
| Indisponibilidad de S3 | El sitio deja de estar disponible si el navegador no tiene los recursos necesarios en caché. | Limitación documentada |

## 6. Manejo de fallos

El módulo `storage.js` contempla errores de lectura y escritura de localStorage para evitar que un problema de almacenamiento local interrumpa la ejecución normal del juego.

Amazon S3 proporciona el alojamiento y distribución de los archivos estáticos. La disponibilidad del sitio depende de este servicio.

## 7. Conclusión

Las pruebas HTTP locales y en Amazon S3 confirmaron que los archivos principales de la aplicación están disponibles y que las solicitudes a recursos inexistentes reciben una respuesta HTTP 404.

Las pruebas realizadas corresponden a disponibilidad y manejo básico de errores. No se realizó una simulación de caída completa de AWS ni una prueba de recuperación ante desastres.

La arquitectura actual no incorpora redundancia multi-región, por lo que una interrupción del servicio de alojamiento afectaría la disponibilidad del sitio.
