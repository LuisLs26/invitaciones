# Publicar y editar desde GitHub

Después de ejecutar `subir-github.bat`, el sitio se publica en:

- Editor: https://luisls26.github.io/invitaciones/editor/?id=demo
- Demo pública: https://luisls26.github.io/invitaciones/invitacion/?id=demo

El editor alojado en GitHub Pages guarda tus cambios en el navegador desde el que editas. Para que una edición sea pública para todas las personas:

1. Pulsa **Descargar JSON** en el editor.
2. Sustituye el archivo descargado en `configs/editor/` con el mismo nombre del proyecto, por ejemplo `demo.json`.
3. Ejecuta `subir-github.bat` y espera a que GitHub Pages termine de publicar.

No coloques claves o contraseñas de GitHub dentro de la página: un sitio estático no debe contenerlas. El `.bat` usa la sesión de Git configurada en tu equipo para publicar de forma segura.
