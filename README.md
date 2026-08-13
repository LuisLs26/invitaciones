# 💌 Invitaciones Digitales e Interactivas

Sistema web estático y reutilizable para crear y vender invitaciones digitales personalizadas (XV Años, Bodas, Cumpleaños, Bautizos, Baby Showers) promocionadas por Facebook Ads y entregadas vía WhatsApp.

---

## 🌟 Características Principales

* **Plantilla Única Reutilizable**: Una sola página HTML (`/invitacion/index.html`) que sirve para ilimitados clientes mediante parámetros de URL.
* **100% Estático (Sin Backend)**: Desarrollado puramente con HTML5, CSS3 y JavaScript Vanilla. Sin bases de datos ni APIs complejas.
* **Experiencia de Usuario Premium**:
  * Portada de apertura interactiva con música de fondo.
  * Cuenta regresiva en vivo.
  * Galería de fotos con visor Lightbox a pantalla completa.
  * Ubicación directa con enlace a Google Maps / Waze.
  * Botón de confirmación (RSVP) que abre WhatsApp con un mensaje pre-configurado.
  * 3 Temas cromáticos automáticos (*XV Años*, *Boda*, *Cumpleaños*).
* **Landing Page Comercial Incluida**: Página principal (`/index.html`) lista para vender planes de **S/ 7**, **S/ 12** y **S/ 20**.

---

## 🚀 Cómo Probarlo Localmente

1. Abra una terminal en la carpeta del proyecto.
2. Inicie un servidor local sencillo (por ejemplo, con Python o Node.js):
   ```bash
   # Opción 1: Con Python
   python -m http.server 8080

   # Opción 2: Con Node / npx
   npx serve .
   ```
3. Abra su navegador en `http://localhost:8080/`.

---

## 🔗 ¿Cómo Funciona la URL `?id=`?

El sistema utiliza la query string de la URL para identificar qué cliente se debe mostrar:

* `http://localhost:8080/invitacion/?id=demo` (Carga `/configs/demo.js` — XV Años)
* `http://localhost:8080/invitacion/?id=cliente1` (Carga `/configs/cliente1.js` — Boda)
* `http://localhost:8080/invitacion/?id=cumpleanos` (Carga `/configs/cumpleanos.js` — Cumpleaños)
* `http://localhost:8080/invitacion/?id=noexiste` (Muestra pantalla amigable de error 404)

---

## 📝 Cómo Crear una Nueva Invitación para un Cliente

1. Entre a la carpeta `/configs/`.
2. Cree un nuevo archivo `.js` con el identificador del cliente (ej. `ana15.js`).
3. Copie la estructura de configuración:

```javascript
const INVITATION_CONFIG = {
    id: "ana15",
    type: "quinceanos", // "quinceanos" | "boda" | "cumpleanos"
    theme: "theme-quinceanos",
    personName: "Ana María",
    title: "Mis XV Años",
    subtitle: "Una noche mágica",
    date: "2026-12-12T20:00:00",
    formattedDate: "Sábado, 12 de Diciembre de 2026",
    time: "8:00 PM",
    locationName: "Salón Elegance",
    address: "Av. Las Luces 450",
    mapUrl: "https://maps.google.com/?q=Salon+Elegance",
    whatsapp: "51900000000",
    whatsappMessage: "¡Hola! Confirmo mi asistencia a los XV Años de Ana. Nombre: ",
    heroImage: "../assets/images/foto_portada.jpg",
    coverQuote: "Hoy celebro una nueva etapa...",
    mainMessage: "Hay momentos en la vida...",
    dressCode: "Vestimenta Elegante / Formal",
    giftInfo: "Cofre de lluvia de sobres en recepción",
    
    // Conmutadores de funciones según la tarifa vendida
    showMusic: true,
    music: "../assets/music/musica_ana.mp3",
    showCountdown: true,
    showGallery: true,
    gallery: [
        { url: "../assets/images/foto1.jpg", caption: "Recuerdo 1" },
        { url: "../assets/images/foto2.jpg", caption: "Recuerdo 2" }
    ],
    showMap: true,
    showVideo: false,
    finalMessage: "¡Gracias por acompañarme!"
};
```
4. Comparta al cliente el enlace: `https://tudominio.com/invitacion/?id=ana15`.

---

## 🖼️ Cómo Cambiar Fotos, Música y Video

* **Fotos**: Guarde las imágenes en la carpeta `/assets/images/` y haga referencia a ellas desde la configuración como `../assets/images/nombre_foto.jpg`.
* **Música**: Guarde el archivo MP3 en `/assets/music/` (ej. `musica.mp3`) y configure `music: "../assets/music/musica.mp3"`.
* **Video**: Guarde el video `.mp4` en `/assets/video/` o coloque una URL de iframe de YouTube / Vimeo.

---

## 🌐 Cómo Publicar en Producción (Sitio Estático)

Al no requerir backend ni bases de datos, este proyecto puede alojarse gratuitamente o a muy bajo costo en:

1. **GitHub Pages**: Suba el repositorio y active GitHub Pages desde la carpeta raíz `/`.
2. **Netlify / Vercel**: Arrastre y suelte la carpeta del proyecto.
3. **Hosting Tradicional (Hostinger, cPanel, etc.)**: Suba todos los archivos por FTP a la carpeta `public_html`.

---

© 2026 Invitaciones Digitales — Todos los derechos reservados.
