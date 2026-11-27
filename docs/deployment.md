# Guía de despliegue

1. Inicia AWS CloudShell.
2. Sube el ZIP del repositorio y descomprímelo.
3. Entra en la carpeta del proyecto.
4. Verifica credenciales y región:
   ```bash
   aws sts get-caller-identity
   aws configure get region
   ```
   La región recomendada para este proyecto es `us-east-2`.
5. Da permisos de ejecución:
   ```bash
   chmod +x scripts/*.sh tests/*.sh
   ```
6. Ejecuta:
   ```bash
   ./scripts/deploy.sh
   ```
7. Guarda la URL que imprime el script y ábrela en el navegador.

El nombre del bucket debe ser único globalmente. El sitio permite lectura pública de sus objetos; no almacenes información privada en este bucket.
