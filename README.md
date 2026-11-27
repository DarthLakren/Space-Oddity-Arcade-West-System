# Space Oddity Arcade West System

Videojuego web tipo space shooter, con estética neon y dificultad progresiva. El único servicio de AWS utilizado para alojar la aplicación es Amazon S3.

## Requisitos
- Cuenta de AWS con permisos para crear y configurar buckets S3.
- AWS CLI configurado.
- Bash (AWS CloudShell funciona).
- Región predeterminada del proyecto: `us-east-2`.

## Ejecutar localmente
Desde la raíz del proyecto:
```bash
cd web
python3 -m http.server 8000
```
Abre `http://localhost:8000`.

## Desplegar en S3
Desde la raíz:
```bash
chmod +x scripts/*.sh tests/*.sh
./scripts/deploy.sh
```
También puedes proporcionar un nombre de bucket globalmente único:
```bash
./scripts/deploy.sh mi-bucket-unico
```
El script crea el bucket, configura el hosting estático, aplica una política de lectura pública y sube `web/`.

## Pruebas básicas
```bash
./tests/resilience.sh http://NOMBRE_BUCKET.s3-website-us-east-2.amazonaws.com
```

## Eliminar recursos
```bash
./scripts/destroy.sh
```
El script solicita escribir `DELETE` antes de borrar los objetos y el bucket.

## Controles
- Flechas izquierda/derecha o A/D: mover nave.
- Espacio: disparar.
- P: pausar.
- Enter: iniciar o reiniciar.

## Alcance de esta primera versión
- Juego Canvas con nave, enemigos, proyectiles, oleadas y puntuación.
- Dificultad progresiva.
- Récord local con `localStorage`.
- Alojamiento web estático en S3.
- Automatización de despliegue por AWS CLI.

## Consideraciones
El endpoint de alojamiento web estático de S3 utiliza HTTP. HTTPS requeriría un servicio adicional, por lo que no se incorpora en esta arquitectura de un solo servicio AWS. Los récords se guardan localmente en el navegador y no se comparten entre dispositivos.
