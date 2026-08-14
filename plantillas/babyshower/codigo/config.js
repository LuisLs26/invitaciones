/**
 * Configuración: Baby Shower (Mateo)
 * Ruta: demos/babyshower/codigo/config.js
 */
const INVITATION_CONFIG = {
    id: "babyshower",
    type: "baby_shower",
    theme: "theme-babyshower",
    personName: "Baby Shower de Mateo",
    title: "¡Esperando a Mateo!",
    subtitle: "Con mucha ilusión y alegría te invitamos a celebrar",
    date: "2026-11-20T17:00:00",
    formattedDate: "Viernes, 20 de Noviembre de 2026",
    time: "5:00 PM",
    locationName: "Jardín Los Rosales & Lounge",
    address: "Av. Las Camelias 280, San Isidro, Lima",
    mapUrl: "https://maps.google.com/?q=San+Isidro+Lima",
    whatsapp: "51900000001",
    whatsappMessage: "¡Hola! Confirmo mi asistencia al Baby Shower de Mateo. Nombre(s): ",
    heroImage: "../imagenes/hero.jpg",
    coverQuote: "Un pequeño gran milagro está en camino para llenar nuestras vidas de amor.",
    mainMessage: "Estamos muy felices por la pronta llegada de nuestro bebé Mateo. Queremos compartir esta linda tarde de juegos, sorpresas y alegría con las personas que más queremos.",
    dressCode: "Casual Elegante / Tonos Pasteles (Celeste, Blanco, Beige)",
    giftInfo: "Mesa de regalos en Tiendas Baby o Sugerencia de Pañales Talla M / L",
    
    // Event Timeline
    timeline: [
        { time: "5:00 PM", title: "Bienvenida & Apertura", description: "Recepción con bocaditos y coctel de bienvenida" },
        { time: "6:00 PM", title: "Juegos Interactivos", description: "Trivia para papás y adivina la medida de la pancita" },
        { time: "7:00 PM", title: "Apertura de Regalos", description: "Descubriendo los detallitos para Mateo" },
        { time: "7:30 PM", title: "Torta & Recuerdos", description: "Foto familiar y entrega de recuerditos" }
    ],

    // Padrinos / Organizadores
    padrinos: [
        { role: "Padres de Mateo", name: "Rodrigo & Sofia" },
        { role: "Tíos Consentidores", name: "Mateo Sr. & Daniela" }
    ],

    showCountdown: true,
    showGallery: true,
    gallery: [
        { url: "../imagenes/galeria1.jpg", caption: "Esperándote con Amor" },
        { url: "../imagenes/galeria2.jpg", caption: "Detalles del Cuartito" },
        { url: "../imagenes/galeria3.jpg", caption: "Ropita & Regalos" }
    ],
    showMap: true,
    finalMessage: "¡Gracias por acompañarnos a recibir a Mateo con tanto cariño!"
};
