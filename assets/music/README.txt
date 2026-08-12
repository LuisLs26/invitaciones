========================================================================
CARPETA DE MÚSICA DE FONDO (/assets/music/)
========================================================================

Instrucciones para reemplazar o agregar música de fondo:

1. Coloque su archivo de audio en formato MP3 en esta carpeta.
2. Ejemplo: /assets/music/musica_xv.mp3
3. En la configuración del cliente (/configs/cliente.js), especifique la ruta:
   
   music: "../assets/music/musica_xv.mp3",
   showMusic: true

Notas sobre la reproducción:
- Por políticas de seguridad de los navegadores (Chrome, Safari, Edge, Firefox),
  el audio NO puede reproducirse automáticamente sin interacción del usuario.
- La plantilla incluye una pantalla de portada "Ver Invitación" que al ser presionada
  desbloquea e inicia la reproducción del audio automáticamente.
- El usuario dispone además de un botón flotante para pausar o reanudar la música en cualquier momento.
