/**
 * Configuración: Cumpleaños #18 (Juan)
 * Tier: Básica (S/ 7)
 * Incluye: Rápido, Dinámico, Música, Countdown, Itinerario, Mapa y RSVP WhatsApp
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
    locationName: "Sky Lounge Club & Terrazas",
    address: "Av. Larco 880, Miraflores, Lima",
    mapUrl: "https://maps.google.com/?q=Miraflores+Lima",
    whatsapp: "51933334444",
    whatsappMessage: "¡Hola Juan! Confirmo mi asistencia a tu fiesta de 18 Años. Nombre(s): ",
    heroImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
    coverQuote: "La vida es una fiesta y los 18 solo se cumplen una vez. ¡Prepara tu mejor energía!",
    mainMessage: "Estoy cumpliendo 18 años y quiero pasarlo con la gente más alegre. Habrá buena música, drinks, piqueos y la mejor vibra toda la noche.",
    dressCode: "Sport Elegante / Urban Chic",
    giftInfo: "Tu presencia y buena vibra es lo único que necesito. Si deseas regalarme algo, bienvenida la lluvia de sobres.",
    
    // Event Timeline
    timeline: [
        { time: "9:00 PM", title: "Welcome Drinks", description: "Recepción en Sky Lounge Bar" },
        { time: "10:30 PM", title: "Soplado de Velas", description: "Torta de cumpleaños y brindis #18" },
        { time: "11:00 PM", title: "DJ Set & Party Night", description: "Pista abierta con lo mejor del reggaeton y electrónica" }
    ],

    // Feature Toggles (Básica - Sin Galería Completa)
    showCountdown: true,
    showGallery: false,
    gallery: [],
    showMap: true,
    showVideo: false,
    video: null,
    finalMessage: "¡Nos vemos en la pista de baile!"
};
