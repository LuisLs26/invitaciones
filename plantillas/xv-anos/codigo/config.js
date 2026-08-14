/**
 * Configuración: XV Años (Ana María)
 * Ruta: demos/xv-anos/codigo/config.js
 */
const INVITATION_CONFIG = {
    id: "xv-anos",
    type: "quinceanos",
    theme: "theme-quinceanos",
    personName: "Ana María",
    title: "Mis XV Años",
    subtitle: "Estás cordialmente invitado a celebrar",
    date: "2026-12-12T20:00:00",
    formattedDate: "Sábado, 12 de Diciembre de 2026",
    time: "8:00 PM",
    locationName: "Salón de Eventos Los Olivos & Jardin de Gala",
    address: "Av. Las Flores 123, San Isidro, Lima",
    mapUrl: "https://maps.google.com/?q=San+Isidro+Lima",
    whatsapp: "51900000001",
    whatsappMessage: "¡Hola! Confirmo mi asistencia a los XV Años de Ana María. Nombre(s): ",
    heroImage: "../imagenes/hero.jpg",
    coverQuote: "Acompañame a celebrar una noche inolvidable llena de magia, sueños y alegría.",
    mainMessage: "Hay momentos en la vida que son verdaderamente especiales, y compartirlos con las personas que más quiero los hace inolvidables. Te espero para celebrar mis 15 años.",
    dressCode: "Rigurosa Etiqueta / Vestido de Gala & Traje Formal",
    giftInfo: "Cofre para Lluvia de Sobres en recepción",
    
    // Event Timeline
    timeline: [
        { time: "8:00 PM", title: "Recepción de Invitados", description: "Llegada al Salón de Gala Los Olivos" },
        { time: "9:00 PM", title: "Entrada Triunfal & Vals", description: "Primer baile de gala con el padre y padrinos" },
        { time: "10:00 PM", title: "Brindis de Honor", description: "Palabras de la quinceañera y familia" },
        { time: "10:30 PM", title: "Apertura de Pista & Fiesta", description: "Cena, DJ en vivo y hora loca" }
    ],

    // Padrinos & Padres
    padrinos: [
        { role: "Padres de la Quinceañera", name: "Roberto María & Patricia Salazar" },
        { role: "Padrinos de Honor", name: "Carlos Mendoza & Silvia María" }
    ],

    // Feature Toggles
    showCountdown: true,
    showGallery: true,
    gallery: [
        { url: "../imagenes/galeria1.jpg", caption: "Sesión Pre-15 Años" },
        { url: "../imagenes/galeria2.jpg", caption: "El Vestido & Salón de Gala" },
        { url: "../imagenes/galeria3.jpg", caption: "Fiesta con Amigos & Familia" },
        { url: "../imagenes/galeria4.jpg", caption: "Torta Principal & Detalles" }
    ],
    showMap: true,
    finalMessage: "¡Gracias por ser parte de este día tan especial en mi vida!"
};
