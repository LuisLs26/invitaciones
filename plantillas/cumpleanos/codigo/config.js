/**
 * Configuración: Cumpleaños #18 (Juan) - Noche de Gala & Celebration
 * Ruta: demos/cumpleanos/codigo/config.js
 */
const INVITATION_CONFIG = {
    id: "cumpleanos",
    type: "cumpleanos",
    theme: "theme-cumpleanos",
    personName: "Juan",
    title: "Mis 18 Años",
    subtitle: "¡Llegó el momento de celebrar a lo grande!",
    date: "2026-09-30T21:00:00",
    formattedDate: "Miércoles, 30 de Septiembre de 2026",
    time: "9:00 PM",
    locationName: "Sky Lounge Club & Terrazas VIP",
    address: "Av. Larco 880, Miraflores, Lima",
    mapUrl: "https://maps.google.com/?q=Miraflores+Lima",
    whatsapp: "51988799404",
    whatsappMessage: "¡Hola Juan! Confirmo mi asistencia a tu fiesta de 18 Años. Nombre(s): ",
    heroImage: "../imagenes/hero.jpg",
    coverQuote: "La vida se mide en momentos inolvidables y risas compartidas. Acompáñame a celebrar una noche épica de cumpleaños.",
    mainMessage: "Celebrar mis 18 años significa comenzar un nuevo capítulo rodeado de las personas que más quiero. He preparado una noche especial con buena música, ambiente exclusivo y momentos inolvidables.",
    dressCode: "Sport Elegante / Urban Chic / Noche de Fiesta",
    giftInfo: "Tu presencia y buena vibra es mi mejor regalo. Si deseas obsequiarme algo, contaremos con cofre para lluvia de sobres.",
    
    // Event Timeline
    timeline: [
        { time: "9:00 PM", title: "Welcome Drinks & Coctelería", description: "Recepción en la Terraza VIP Sky Lounge Bar" },
        { time: "10:30 PM", title: "Soplado de Velas & Brindis", description: "Torta de cumpleaños y brindis de honor #18" },
        { time: "11:00 PM", title: "DJ Live Set & Pista Abierta", description: "Lo mejor del reggaeton, pop y música electrónica" },
        { time: "1:00 AM", title: "Hora Loca & Celebration", description: "Cotillón de fiesta, sorpresas y baile hasta el amanecer" }
    ],

    // Padrinos / Familiares de Honor
    padrinos: [
        { role: "Padres de Juan", name: "Carlos María & Carmen Salazar" },
        { role: "Padrinos de Honor", name: "Gabriel Mendoza & Daniela Morales" }
    ],

    showCountdown: true,
    showGallery: true,
    gallery: [
        { url: "../imagenes/galeria1.jpg", caption: "Celebración & Amigos" },
        { url: "../imagenes/galeria2.jpg", caption: "Noches Inolvidables" },
        { url: "../imagenes/galeria3.jpg", caption: "Momentos Especiales" }
    ],
    showMap: true,
    finalMessage: "¡Prepara tu mejor energía y nos vemos en la pista de baile!"
};
