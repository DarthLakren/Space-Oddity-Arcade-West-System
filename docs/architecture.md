# Arquitectura

El navegador solicita los archivos estáticos directamente a Amazon S3. S3 entrega HTML, CSS, JavaScript y recursos del juego. El navegador ejecuta la lógica con Canvas API.

```mermaid
flowchart TD
    A[Jugador / Navegador] -->|HTTP GET| B[Amazon S3 - Static Website Hosting]
    B -->|HTML, CSS, JavaScript| A
    A --> C[Canvas API - juego]
    A --> D[localStorage - récord local]
```

Amazon S3 es el único servicio AWS de la solución. Canvas API y localStorage son capacidades del navegador, no servicios AWS.
