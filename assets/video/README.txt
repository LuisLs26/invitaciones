========================================================================
CARPETA DE VIDEO DE MUESTRA (/assets/video/)
========================================================================

Instrucciones para colocar o vincular videos en el plan Premium+ (S/20):

1. Opción MP3/MP4 Local:
   Coloque su video en formato MP4 en esta carpeta (ej. /assets/video/video_xv.mp4)
   Y configúrelo en /configs/cliente.js:
   
   video: "../assets/video/video_xv.mp4",
   showVideo: true

2. Opción Embebido (YouTube / Vimeo / Shorts / Reels):
   También puede colocar una URL de YouTube o Vimeo embebida:
   
   video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
   showVideo: true

La plantilla detectará automáticamente si se trata de un archivo de video local .mp4 o un enlace embebido de iframe.
