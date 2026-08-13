/**
 * Configuración: Baby Shower de Mateo
 * Tier: Premium (S/ 12)
 * Incluye: Música, Galería, Countdown, Itinerario, Padrinos/Padres, Lista de Regalos, Mapa y RSVP WhatsApp
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
    whatsapp: "51922223333",
    whatsappMessage: "¡Hola! Confirmo mi asistencia al Baby Shower de Mateo. Nombre(s): ",
    heroImage: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80",
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

    // Feature Toggles (Premium)
    showMusic: true,
    music: "../assets/music/sample.mp3",
    showCountdown: true,
    showGallery: true,
    gallery: [
        { url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80", caption: "Esperándote con Amor" },
        { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80", caption: "Detalles del Cuartito" },
        { url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80", caption: "Ropita & Regalos" }
    ],
    showMap: true,
    showVideo: false,
    video: null,
    finalMessage: "¡Gracias por acompañarnos a recibir a Mateo con tanto cariño!"
};
