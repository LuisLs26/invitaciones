# 💌 Invitaciones Digitales e Interactivas

Sistema web estático y reutilizable para crear y vender invitaciones digitales personalizadas (XV Años, Bodas, Cumpleaños, Bautizos, Baby Showers) promocionadas por Facebook Ads y entregadas vía WhatsApp.

---

## 🌟 Características Principales

* **Editor Visual Profesional tipo Canva (`/editor/`)**: Herramienta interactiva e independiente para creadores y administradores. Permite editar la invitación real completa en tiempo real, mover y rotar GIFs, hacer doble clic para editar texto directamente en vivo, reordenar secciones y gestionar galerías de fotos.
* **Plantilla Única Reutilizable**: Una sola página HTML (`/invitacion/index.html`) que sirve para ilimitados clientes mediante parámetros de URL.
* **100% Estático (Sin Backend)**: Desarrollado puramente con HTML5, CSS3 y JavaScript Vanilla. Compatible con **Cloudflare Pages**, GitHub Pages, Vercel y Netlify.
* **Experiencia de Usuario Premium**:
  * Portada de apertura interactiva con música de fondo.
  * Cuenta regresiva en vivo.
  * Galería de fotos con visor Lightbox a pantalla completa.
  * Ubicación directa con enlace a Google Maps / Waze.
  * Botón de confirmación (RSVP) que abre WhatsApp con un mensaje pre-configurado.
  * 3 Temas cromáticos automáticos (*XV Años*, *Boda*, *Cumpleaños*).
* **Landing Page Comercial Incluida**: Página principal (`/index.html`) lista para vender planes de **S/ 7**, **S/ 12** y **S/ 20**.

---

## 🚀 Desarrollo Local & GitHub Codespaces

### En Entorno Local
1. Inicie un servidor local:
   ```bash
   python -m http.server 8080
   ```
2. Abra su navegador en:
   * **Landing Comercial**: `http://localhost:8080/`
   * **Editor Visual**: `http://localhost:8080/editor/?id=demo`
   * **Invitación Pública**: `http://localhost:8080/invitacion/?id=demo`

### En GitHub Codespaces
1. Abra el repositorio en GitHub y haga clic en **Code > Open in Codespaces**.
2. Ejecute en la terminal de Codespaces:
   ```bash
   python -m http.server 8080
   ```
3. Abra la vista previa del puerto 8080 para ingresar al editor `/editor/`.
4. Edite visualmente la demo deseada, haga clic en `💾 GUARDAR` y `📤 Exportar JSON`.
5. Guarde o sincronice la configuración JSON en `/configs/editor/[id].json`.
6. Realice `git commit` y `git push` desde la terminal o mediante el script `subir-github.bat`.

---

## 🔗 ¿Cómo Funciona la URL `?id=`?

El sistema utiliza la query string de la URL para identificar qué cliente se debe mostrar:

* `http://localhost:8080/invitacion/?id=demo` (Carga `/configs/editor/demo.json` / `/configs/demo.js` — XV Años)
* `http://localhost:8080/invitacion/?id=cliente1` (Carga `/configs/editor/cliente1.json` / `/configs/cliente1.js` — Boda)
* `http://localhost:8080/invitacion/?id=cumpleanos` (Carga `/configs/editor/cumpleanos.json` / `/configs/cumpleanos.js` — Cumpleaños)

---

## 📝 Configuración y Exportación JSON

El editor guarda automáticamente en `localStorage` y permite exportar e importar archivos `.json` estructurados en `/configs/editor/`:

```json
{
  "id": "demo",
  "type": "quinceanos",
  "theme": "theme-quinceanos",
  "personName": "Ana María",
  "title": "Mis XV Años",
  "formattedDate": "Sábado, 12 de Diciembre de 2026",
  "time": "8:00 PM",
  "locationName": "Salón Jardín de las Rosas",
  "address": "Av. Las Flores 123, San Isidro",
  "whatsapp": "51900000000",
  "gallery": [
    { "url": "../assets/images/xv/g1.svg", "caption": "Recuerdo 1" }
  ]
}
```

---

## 🌐 Publicación en Cloudflare Pages

1. Vincule su repositorio de GitHub en **Cloudflare Pages**.
2. Seleccione el directorio raíz (`/`) como raíz de compilación.
3. Al publicar, la versión pública (`/invitacion/`) y las invitaciones personalizadas se desplegarán al instante sin costo de hosting.

---

© 2026 Invitaciones Digitales — Todos los derechos reservados.
