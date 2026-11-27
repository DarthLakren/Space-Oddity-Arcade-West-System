# Pruebas de resiliencia

| Escenario | Comportamiento esperado | Tipo |
|---|---|---|
| Recurso estático inexistente | S3 responde con error; la aplicación no debe asumir que el archivo existe | Simulación con URL inexistente |
| localStorage bloqueado | El juego continúa; el guardado del récord falla de forma controlada | Manejado en `storage.js` |
| Recarga del navegador | El récord local permanece en el mismo navegador | Prueba manual |
| Pérdida de Internet | Los recursos que no estén en caché dejan de descargarse; el sitio no está disponible | Prueba manual |
| Indisponibilidad de S3 | El navegador no puede obtener la aplicación si no tiene los recursos en caché | Limitación documentada |

Ejecuta las comprobaciones HTTP básicas con:
```bash
./tests/resilience.sh URL_DEL_SITIO
```

La aplicación captura los errores de lectura y escritura de `localStorage`. La disponibilidad del sitio depende de Amazon S3; esta versión no incorpora redundancia multi-región ni otro servicio de AWS.
