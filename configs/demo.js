/**
 * Configuración: Mis XV Años (Ana María)
 * Tier: Premium+ (S/ 20)
 * Incluye: Música, Galería, Countdown, Mapa, Video, Animaciones y RSVP WhatsApp
 */
const INVITATION_CONFIG = {
    id: "demo",
    type: "quinceanos",
    theme: "theme-quinceanos",
    personName: "Ana María",
    title: "Mis XV Años",
    subtitle: "Una noche mágica e inolvidable",
    date: "2026-12-12T20:00:00", // ISO string for Javascript countdown calculation
    formattedDate: "Sábado, 12 de Diciembre de 2026",
    time: "8:00 PM (Recepción)",
    locationName: "Salón Elegance & Eventos",
    address: "Av. Las Luces 450, Urb. El Jardín, Lima",
    mapUrl: "https://maps.google.com/?q=Salon+Elegance+Lima",
    whatsapp: "51900000000",
    whatsappMessage: "¡Hola! Quiero confirmar mi asistencia a los XV Años de Ana María ✨. Nombre(s): ",
    heroImage: "../assets/images/xv_hero.svg",
    coverQuote: "Hoy celebro el comienzo de una nueva etapa llena de sueños y alegría.",
    mainMessage: "Hay momentos en la vida que son especiales por sí solos, pero compartirlos con las personas que más quiero los hace inolvidables. Te espero para celebrar mis 15 años.",
    dressCode: "Vestimenta Elegante / Formal (Evitar color Rosa y Dorado)",
    giftInfo: "Tu presencia es mi mejor regalo. Si deseas hacerme un presente, contaremos con cofre para lluvia de sobres.",
    
    // Feature Toggles (Premium+)
    showMusic: true,
    music: "../assets/music/sample.mp3",
    showCountdown: true,
    showGallery: true,
    gallery: [
        { url: "../assets/images/gallery1.svg", caption: "Sesión Pre-15 Años" },
        { url: "../assets/images/gallery2.svg", caption: "Momentos Inolvidables" },
        { url: "../assets/images/gallery3.svg", caption: "Familia y Amigos" },
        { url: "../assets/images/gallery4.svg", caption: "Preparativos de la Gran Noche" }
    ],
    showMap: true,
    showVideo: true,
    video: "../assets/video/README.txt", // Video placeholder indicator
    finalMessage: "¡Gracias por acompañarme en este día tan especial! ✨"
};
